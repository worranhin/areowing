import Phaser from "phaser";

export default class GameStart extends Phaser.Scene {
    constructor() {
        super('game-start');
    }

    create() {
        const WIDTH = this.scale.width;
        const HEIGHT = this.scale.height;
        const centerX = WIDTH * 0.5;
        const centerY = HEIGHT * 0.5;
        const gap = 20;

        const titleStyle = {color: "white", fontSize: "4em"};
        const textStyle = {color: "white", fontSize: "2em"};

        const text_title = this.add.text(centerX, centerY, "Aero Wing", titleStyle).setOrigin(0.5, 1);
        const text_tips = this.add.text(centerX, centerY, "Press SPACE to start the game.", textStyle).setOrigin(0.5, 1);
        const text_description = this.add.text(centerX, centerY, "Stay away from the rocks, survive as long as you can.", textStyle).setOrigin(0.5, 1);
        this.moveBelow(text_tips, text_title, gap);
        this.moveBelow(text_description, text_tips, gap);

        this.input.keyboard.once("keydown-SPACE", () => {
            this.scene.start("game");
        })
    }

    private moveBelow(obj: Phaser.GameObjects.Text, target: Phaser.GameObjects.Text, gap: number) {
        obj.setY(target.y + target.displayHeight * 0.5 +obj.displayHeight * 0.5 + gap);
    }
}