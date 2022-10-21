import Phaser from "phaser";

export default class Game extends Phaser.Scene
{
    private hp = 5;
    private lastTime = 0;
    private player!: Phaser.GameObjects.Triangle
    private rocks!: Phaser.Physics.Arcade.Group
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
    private hpText!: Phaser.GameObjects.Text
    private timeText!: Phaser.GameObjects.Text;

    constructor() {
        super('game');
    }

    init() {
        this.hp = 5;
        this.lastTime = 0;
    }

    preload()
    {
        this.load.path = './assets/';  // 路径前缀
        this.load.image('sky', 'sky.png');
        this.load.image('bomb', 'bomb.png');
        this.load.image('rock', 'rock.png');
        this.load.image('carrot', 'star.png');
        this.load.audio('impact', "impact_sound.ogg");

        // create keyboard cursor input
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    create()
    {
        const WIDTH = this.cameras.main.width;
        const HEIGHT = this.cameras.main.height;

        // 创建实体
        const triangle = this.add.triangle(WIDTH / 2, HEIGHT - 100, 0, 100, 100, 100, 50, 0, 0x2233ee);

        // create and init rocks
        this.rocks = this.physics.add.group();
        for(let i = 0; i < 5; i++) {
            const x = Phaser.Math.Between(0.2 * WIDTH, 0.8 * WIDTH);
            const y = 0;
            const rock = this.rocks.create(x, y, 'rock');
            rock.setScale(0.2);
            rock.body.updateFromGameObject();
            const rockSpeed = Phaser.Math.Between(50, 100);
            rock.body.setVelocity(0, rockSpeed);
        }


        // 物理系统 //
        this.player = this.physics.add.existing(triangle, false);  // 创建玩家实例
        this.physics.add.collider(this.player, this.rocks, this.handleCrush, undefined, this);  // 添加 player-rocks 碰撞检测
        const body = this.player.body as Phaser.Physics.Arcade.Body;
        body.setBounce(0.8, 0.8);  // 设置玩家反弹
        this.physics.world.setBounds(0, 0, WIDTH, HEIGHT);  // 设置游戏边界

        // 绑定镜头
        // this.cameras.main.startFollow(this.player);
        // set dead zone
        // this.cameras.main.setDeadzone(this.scale.width * 0.8, this.scale.height * 0.8);

        // create text //
        const textStyle = {color: "white", fontSize: "24px"};
        this.hpText = this.add.text(240, 10, "hp: 5", textStyle).setScrollFactor(0).setOrigin(0.5, 0);
        this.timeText = this.add.text(0, 10, "last time: 0 s", textStyle);
        this.timeText.setX(this.hpText.x + this.hpText.displayWidth * 0.5 + this.timeText.displayWidth * 0.5 + 20);  // TODO: 写入工具库

    }

    //TODO: 拆分模块（太长了）
    update(_time: number, delta: number) {
        const HEIGHT = this.cameras.main.height;
        const WIDTH = this.cameras.main.width;

        // 结束判断 //
        if(this.hp < 1) {
            this.scene.start("game-over", {score: this.lastTime});
        }


        // 更新持续时间 //
        this.lastTime += delta;
        const displayTime = Math.floor(this.lastTime / 1000);
        this.timeText.setText(`last time: ${displayTime} s`);


        // 刷新 rocks: rocks 移出屏幕时重新生成 //
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


        // 玩家控制 player control //
        const playerAcc = 500;  // 加速度

        let accX = 0;
        let accY = 0;

        // 左右控制
        if(this.cursors.left.isDown) {
            accX -= playerAcc;
        } else if(this.cursors.right.isDown) {
            accX += playerAcc;
        }

        // 上下控制
        if(this.cursors.up.isDown) {
            accY -= playerAcc;
        } else if(this.cursors.down.isDown) {
            accY += playerAcc;
        }

        // 出界判断
        const playerX = this.player.x;
        const playerY = this.player.y;
        const boundForce = 50;  // 退回的力道

        if(playerX < 0) {
            accX += -playerX * boundForce;
        } else if(playerX > WIDTH) {
            accX += (WIDTH - playerX) * boundForce;
        }

        if(playerY < 0) {
            accY += -playerY * boundForce;
        } else if(playerY > HEIGHT) {
            accY += (HEIGHT - playerY) * boundForce;
        }

        const body = this.player.body as Phaser.Physics.Arcade.Body;
        body.setAcceleration(accX, accY);
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
}