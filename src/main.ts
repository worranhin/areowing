// import { FirstGameScene } from './first-scene';
// import BackgroundExample from './src/Example/background-test.js';
// import CircleExample from './src/Example/Circle.js'
import Phaser from 'phaser';
// import './style.css';
import Preloader from './scenes/Preloader.js';
import Game from './scenes/Game.js';
import GameOver from './scenes/GameOver.js';
import GameStart from './scenes/GameStart.js';

const Width = window.innerWidth;
const Height = window.innerHeight;

const config/*: Phaser.Types.Core.GameConfig*/ = {
    width: Width,
    height: Height,
    type: Phaser.AUTO,  // 自行决定使用 Canvas or WebGL
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 0,
                x: 0,
            },
            debug: true,
        }
    },
    scene: [Preloader, GameStart, Game, GameOver],
};

new Phaser.Game(config);