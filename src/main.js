const tileSize = 32;
const mapWidth = 18; // Number of tiles across map
const gameSize = tileSize * mapWidth;
let tpLength = 2;

let config = {
    type: Phaser.CANVAS, // Changed from WebGL
    pixelArt: true, // Helps prevent tile bleeing
    width: gameSize,
    height: gameSize,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
        }
    },
    scene: [Menu, Play]
}

let game = new Phaser.Game(config);
let keyW, keyA, keyS, keyD, keySHIFT, keySPACE;