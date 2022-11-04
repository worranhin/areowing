import Phaser from "phaser";
import SceneKeys from "../consts/SceneKeys";

export default class GameOver extends Phaser.Scene {
    constructor() {
        super(SceneKeys.GameOver);
    }

    create(data: { score: number; }) {
        const WIDTH = this.scale.width;
        const HEIGHT = this.scale.height;
        const centerX = WIDTH * 0.5;
        const centerY = HEIGHT * 0.5;
        const gap = 20;  // 文字间的间隙
        const score = data.score;  // 分数 (ms)
        const lastSec = Math.floor(score / 1000);  // 显示的分数 (s)

        const titleStyle = {color: "white", fontSize: "4em"};  // 文字的样式
        const textStyle = {color: "white", fontSize: "2em"};

        const gameOverText = this.add.text(centerX, centerY, "Game Over!", titleStyle).setOrigin(0.5, 1);
        const scoreText = this.add.text(centerX, centerY, `You have survived ${lastSec} seconds`, textStyle).setOrigin(0.5, 1);
        const tipsText = this.add.text(centerX, centerY, "Press SPACE to start again.", textStyle).setOrigin(0.5, 1);
        this.moveBelow(scoreText, gameOverText, gap);
        this.moveBelow(tipsText, scoreText, gap);

        this.input.keyboard.once("keydown-SPACE", () => {
            this.scene.start(SceneKeys.Game);
        })
    }

    // TODO: 写成工具库
    private moveBelow(obj: Phaser.GameObjects.Text, target: Phaser.GameObjects.Text, gap: number) {
        obj.setY(target.y + target.displayHeight * 0.5 +obj.displayHeight * 0.5 + gap);
    }
}