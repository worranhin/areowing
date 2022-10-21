import Phaser from "phaser";
import SceneKeys from "../consts/SceneKeys";
import TextureKeys from "../consts/TextureKeys";
import AudioKeys from "../consts/AudioKeys";

export default class Preloader extends Phaser.Scene
{
    constructor() {
        super(SceneKeys.Preloader);
    }

    preload()
    {
        this.load.path = './assets/';  // 路径前缀
        // this.load.image('sky', 'sky.png');
        // this.load.image('bomb', 'bomb.png');
        this.load.image(TextureKeys.Rock, 'rock.png');
        // this.load.image('carrot', 'star.png');
        this.load.audio(AudioKeys.Impact, "impact_sound.ogg");
    }

    create() 
    {
        this.scene.start(SceneKeys.GameStart);
    }
}