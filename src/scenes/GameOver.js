import Phaser from "phaser";

export default class GameOver extends Phaser.Scene {
    constructor() {
        super('game-over');
    }

    create() {
        const WIDTH = this.scale.width;
        const HEIGHT = this.scale.height;
        const centerX = WIDTH * 0.5;
        const centerY = HEIGHT * 0.5;
        const gap = 20;

        const titleStyle = {color: "white", fontSize: "4em"};
        const textStyle = {color: "white", fontSize: "2em"};

        const text_gameOver = this.add.text(centerX, centerY, "Game Over!", titleStyle).setOrigin(0.5, 1);
        const text_tips = this.add.text(centerX, centerY, "Press SPACE to start again.", textStyle).setOrigin(0.5, 1);
        text_tips.setY(text_gameOver.y + text_gameOver.displayHeight * 0.5 +text_tips.displayHeight + gap);

        this.input.keyboard.once("keydown-SPACE", () => {
            this.scene.start("game");
        })
    }
}