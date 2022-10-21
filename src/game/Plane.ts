import Phaser from "phaser";

export default class Plane extends Phaser.Physics.Arcade.Sprite
{
    private cursors

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string | Phaser.Textures.Texture) 
    {
        super(scene, x, y, texture);

        scene.physics.add.existing(this);
        
        // create keyboard cursor input
        this.cursors = scene.input.keyboard.createCursorKeys();

        
    }

    preUpdate()
    {
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

        const body = this.body as Phaser.Physics.Arcade.Body;
        body.setAcceleration(accX, accY);

        // 出界判断
        // const playerX = this.x;
        // const playerY = this.y;
        // const boundForce = 50;  // 退回的力道

        // if(playerX < 0) {
        //     accX += -playerX * boundForce;
        // } else if(playerX > WIDTH) {
        //     accX += (WIDTH - playerX) * boundForce;
        // }

        // if(playerY < 0) {
        //     accY += -playerY * boundForce;
        // } else if(playerY > HEIGHT) {
        //     accY += (HEIGHT - playerY) * boundForce;
        // }
    }
}