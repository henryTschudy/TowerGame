const tileSize = 32;
const mapWidth = 18; // Number of tiles across map
const mapHeight = 19;
const roomWidth = tileSize * mapWidth;
const roomHeight = tileSize * mapHeight;
const frameRate = 5;
let tpLength = 6;

let config = {
    type: Phaser.CANVAS, // Changed from WebGL
    pixelArt: true, // Helps prevent tile bleeing
    scale: {
        mode: Phaser.Scale.FIT,
        width: roomWidth,
        height: roomHeight
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
        }
    },
    scene: [Help, Menu, Hud, Play, goodEnding],
    canvas: document.querySelector('canvas')
}

let game = new Phaser.Game(config);
let keyW, keyA, keyS, keyD, keySHIFT, keySPACE, keyESC, keyZERO;