class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        this.load.image('tiles', [ 'assets/tilemaps/tiles/drawtiles1.png', 'assets/tilemaps/tiles/drawtiles1_n.png' ]);
        this.load.image('player', 'assets/sprites/player.png');
        this.load.tilemapCSV('map', 'assets/tilemaps/csv/grid.csv');
    }

    create() {
        // Produce static map elements
        var map = this.make.tilemap({ key: 'map', tileWidth: tileSize, tileHeight: tileSize });
        var tileset = map.addTilesetImage('tiles', null, tileSize, tileSize, 1, 2);

        // Produce key meanings
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keySHIFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
        
        // Add in the player
        this.player = new Player(this, tileSize * 2, tileSize * 2, 'player').setOrigin(0);

        // Add in the moving tiles
        console.log('In here!');
    }

    update(time, delta) {
        this.player.update()
        // this.movingBlocks.update() ?
    }
}