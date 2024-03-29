import Phaser from "phaser";
import SceneKeys from "../consts/SceneKeys";
import TextureKeys from "../consts/TextureKeys";
import Plane from "../game/Plane";

export default class Game extends Phaser.Scene
{
    private hp = 5;
    private lastTime = 0;
    private rocks!: Phaser.Physics.Arcade.Group
    private plane!: Phaser.Physics.Arcade.Sprite
    private hpText!: Phaser.GameObjects.Text
    private timeText!: Phaser.GameObjects.Text;

    constructor() {
        super(SceneKeys.Game);
    }

    init() {
        this.hp = 5;
        this.lastTime = 0;
    }

    preload()
    {
        // preload
    }

    create()
    {
        const WIDTH = this.cameras.main.width;
        const HEIGHT = this.cameras.main.height;

        // 创建实体
        // const triangle = this.add.triangle(WIDTH / 2, HEIGHT - 100, 0, 100, 100, 100, 50, 0, 0x2233ee);

        // create and init rocks
        this.rocks = this.physics.add.group();
        for(let i = 0; i < 5; i++) {
            const x = Phaser.Math.Between(0 * WIDTH, 1 * WIDTH);
            const y = Phaser.Math.Between(-200, -100);
            const rock = this.rocks.create(x, y, TextureKeys.Rock);
            rock.setScale(0.2);
            rock.body.updateFromGameObject();
            const rockSpeed = Phaser.Math.Between(50, 100);
            rock.body.setVelocity(0, rockSpeed);
        }


        // 物理系统 //
        this.plane = new Plane(this, WIDTH * 0.5, HEIGHT - 100, TextureKeys.Plane);
        this.add.existing(this.plane);
        this.physics.add.collider(this.plane, this.rocks, this.handleCrush, undefined, this);  // 碰撞处理
        const body = this.plane.body as Phaser.Physics.Arcade.Body;
        body.setBounce(0.7, 0.7);  // 设置反弹系数
        // this.physics.world.setBounds(0, 0, WIDTH, HEIGHT);  // 设置游戏边界

        // create text //
        const textStyle = {color: "white", fontSize: "24px"};
        this.hpText = this.add.text(240, 10, "hp: 5", textStyle).setScrollFactor(0).setOrigin(0.5, 0);
        this.timeText = this.add.text(0, 10, "last time: 0 s", textStyle);
        this.timeText.setX(this.hpText.x + this.hpText.displayWidth * 0.5 + this.timeText.displayWidth * 0.5 + 20);  // TODO: 写入工具库

    }

    //TODO: 拆分模块（太长了）
    update(_time: number, delta: number) {
        // 结束判断 //
        if(this.hp < 1) {
            this.scene.start(SceneKeys.GameOver, {score: this.lastTime});
        }

        // 更新持续时间 //
        this.lastTime += delta;
        const displayTime = Math.floor(this.lastTime / 1000);
        this.timeText.setText(`last time: ${displayTime} s`);

        this.wrapRocks();
        this.wrapPlane();
    }

    private handleCrush(_player: Phaser.GameObjects.GameObject, rock: Phaser.GameObjects.GameObject) {
        // rock disappear
        this.rocks.killAndHide(rock);
        this.physics.world.disable(rock);

        // decrease hp
        this.hp--;
        this.hpText.setText(`hp: ${this.hp}`);

        // sound
        this.sound.play('impact');
    }

    // 刷新 rocks: rocks 移出屏幕时重新生成 //
    private wrapRocks() {
        const WIDTH = this.scale.width;
        const HEIGHT = this.scale.height;

        this.rocks.children.iterate((child) => {
            const rock = child as Phaser.Physics.Arcade.Sprite;  // TODO: 类型不一致？
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
                const body = rock.body as Phaser.Physics.Arcade.Body;
                body.x = Phaser.Math.Between(0.1 * WIDTH, 0.9 * WIDTH);
                body.y = scrollY - rock.body.height - Phaser.Math.Between(50, 100);

                const velocity = Phaser.Math.Between(50, 100) + this.lastTime / 100;  // 每隔 1s 加 10 速度
                body.setVelocity(0, velocity);
            }
        });
    }

    // 出界判断
    private wrapPlane() 
    {
        this.physics.world.wrap(this.plane);
        
        //TODO: 适配这段代码，或者不管它直接删掉
        
        // const WIDTH = this.scale.width;
        // const HEIGHT = this.scale.height;
        // console.log(this.plane);
        // const playerX = this.plane.x;
        // const playerY = this.plane.y;
        // const boundForce = 50;  // 退回的力道

        // const body = this.plane.body as Phaser.Physics.Arcade.Body;

        // if(playerX < 0) {
        //     body.acceleration.x += -playerX * boundForce;
        // } else if(playerX > WIDTH) {
        //     body.acceleration.x += (WIDTH - playerX) * boundForce;
        // }

        // if(playerY < 0) {
        //     body.acceleration.y += -playerY * boundForce;
        // } else if(playerY > HEIGHT) {
        //     body.acceleration.y += (HEIGHT - playerY) * boundForce;
        // }

        // body.setAcceleration(accX, accY);
    }
}