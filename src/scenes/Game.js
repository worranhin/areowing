import Phaser from "phaser";

export default class Game extends Phaser.Scene
{
    constructor() {
        super('game');
    }

    preload()
    {
        this.load.image('sky', './assets/sky.png');
    }

    create()
    {
        const Width = this.cameras.main.width;
        const Height = this.cameras.main.height;
        // this.add.image(Width / 2, Height / 2, 'sky');
        // 创建实体
        this.player = this.add.triangle(Width / 2, Height - 100, 0, 0, 100, 0, 50, -100, 0x2233ee);
        this.enemy = this.add.rectangle(Width / 2, 150, 90, 100, 0xff3333, 1);

        // 事件监听

        // 玩家控制
        this.input.keyboard.on('keydown-A', () => {
            this.player.setX(this.player.x - 5);
        });
        this.input.keyboard.on('keydown-D', () => {
            this.player.setX(this.player.x + 5);
        });
        this.input.keyboard.on('keydown-W', () => {
            this.player.setY(this.player.y + 5);
        });
        this.input.keyboard.on('keydown-S', () => {
            this.player.setY(this.player.y - 5);
        });
    }

    update(time, delta) {
        const w = this.cameras.main.width;
        this.enemy.setX(100 * Math.sin(time / 500) + w / 2);
    }
}