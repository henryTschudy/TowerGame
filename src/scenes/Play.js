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

        // Add in the player
        this.player = new Player(this, tileSize * 2, tileSize * 2, 'player');

        // Add in the moving tiles
        console.log('In here!');
    }

    update(time, delta) {
        this.player.update()
        // this.movingBlocks.update() ?
    }
}