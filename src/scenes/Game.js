import Phaser from "phaser";
import Carrot from "../game/Carrot.js";

export default class Game extends Phaser.Scene
{
    /** @type {Phaser.GameObjects.Triangle} */
    player
    /** @type {Phaser.Physics.Arcade.Group} */
    rocks
    /** @type {Phaser.Types.Input.Keyboard.CursorKeys} */
    cursors
    /** @type {Phaser.Physics.Arcade.Group} */
    carrots

    constructor() {
        super('game');
    }

    preload()
    {
        this.load.path = './assets/';  // 路径前缀
        this.load.image('sky', 'sky.png');
        this.load.image('bomb', 'bomb.png');
        this.load.image('rock', 'rock.png');
        this.load.image('carrot', 'star.png');

        // create keyboard cursor input
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    create()
    {
        const WIDTH = this.cameras.main.width;
        const HEIGHT = this.cameras.main.height;
        // this.add.image(Width / 2, Height / 2, 'sky');
        // 创建实体
        const triangle = this.add.triangle(WIDTH / 2, HEIGHT - 100, 0, 100, 100, 100, 50, 0, 0x2233ee);
        // const rect = this.add.rectangle(WIDTH / 2, HEIGHT - 200, 50, 50, 0xff3333, 1);

        // create and init rocks
        this.rocks = this.physics.add.group();
        for(let i = 0; i < 5; i++) {
            let x = Phaser.Math.Between(0.2 * WIDTH, 0.8 * WIDTH);
            let y = 100 + i * 100;
            const rock = this.rocks.create(x, y, 'rock');
            rock.setScale(0.2);
            rock.body.updateFromGameObject();
            const rockSpeed = Phaser.Math.Between(50, 100);
            rock.body.setVelocity(0, rockSpeed);
        }


        // 绑定物理系统
        this.player = this.physics.add.existing(triangle, false);
        // this.enemy = this.physics.add.existing(rect, false);
        this.physics.add.collider(this.player, this.rocks, this.handleCrush, undefined, this);
        // this.physics.add.collider(this.player, this.enemy);

        this.player.body.setBounce(0.8, 0.8);  // 设置反弹

        // 绑定镜头
        // this.cameras.main.startFollow(this.player);
        // set dead zone
        // this.cameras.main.setDeadzone(this.scale.width * 0.8, this.scale.height * 0.8);

        this.physics.world.setBounds(0, 0, WIDTH, HEIGHT);
        this.physics.world.wrapObject(this.player.body);
        this.physics.world.wrapObject(this.player);

        // create carrot
        this.carrots = this.physics.add.group({classType: Carrot});
        this.carrots.get(300, 300, 'carrot');
        this.physics.add.overlap(this.player, this.carrots, this.handleCollect, undefined, this);

    }

    update(time, delta) {
        // 刷新 rocks: rocks 移出屏幕时重新生成 //
        this.rocks.children.iterate(child => {
            /** @type {Phaser.Physics.Arcade.Sprite} */
            const rock = child;
            const HEIGHT = this.cameras.main.height;
            const WIDTH = this.cameras.main.width;
            const scrollY = this.cameras.main.scrollY;

            // TODO: 这2段代码也许还能优化
            const isDeactivated = rock.active === false;
            const isOutBound = rock.y >= scrollY + HEIGHT + rock.body.height / 2;

            if(isDeactivated) {
                // 若 deactivated 需要重新激活
                rock.setActive(true);
                rock.setVisible(true);
                this.physics.world.enable(rock);
            }

            if(isDeactivated || isOutBound) {
                rock.body.x = Phaser.Math.Between(0.1 * WIDTH, 0.9 * WIDTH);
                rock.body.y = scrollY - rock.body.height - Phaser.Math.Between(50, 100);
                const velocity = Phaser.Math.Between(50, 100);
                rock.body.setVelocity(0, velocity);
            }
        });

        // player control //
        const playerAcc = 500;  // 加速度

        // 左右控制
        if(this.cursors.left.isDown) {
            this.player.body.setAccelerationX(-playerAcc);
        } else if(this.cursors.right.isDown) {
            this.player.body.setAccelerationX(playerAcc);
        } else {
            this.player.body.setAccelerationX(0);
        }

        // 上下控制
        if(this.cursors.up.isDown) {
            this.player.body.setAccelerationY(-playerAcc);
        } else if(this.cursors.down.isDown) {
            this.player.body.setAccelerationY(playerAcc);
        } else {
            this.player.body.setAccelerationY(0);
        }

        this.physics.world.wrapObject(this.player);
    }

    handleCollect(player, carrot) {
        this.carrots.killAndHide(carrot);
    }

    handleCrush(player, rock) {
        this.rocks.killAndHide(rock);
        this.physics.world.disable(rock);
    }
}