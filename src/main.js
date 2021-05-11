const tileSize = 32;

let config = {
    type: Phaser.WEBGL,
    width: 576, // 32 * 18
    height: 576,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
        }
    },
    scene: [Menu, Play]
}

let game = new Phaser.Game(config);
let keyW, keyA, keyS, keyD, keySHIFT;