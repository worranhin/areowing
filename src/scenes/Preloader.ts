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
        this.load.image(TextureKeys.Rock, 'rock.png');
        this.load.image(TextureKeys.Plane, 'ship_0001.png');
        this.load.audio(AudioKeys.Impact, "impact_sound.ogg");
    }

    create() 
    {
        this.scene.start(SceneKeys.GameStart);
    }
}