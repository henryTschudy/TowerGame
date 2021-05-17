class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // im kinda half asleep so i'll figure out these imports later
        // Tilemap file is actually 576 x 4000 some in size. The latter is so we can scroll between levels.
        this.load.image('tiles', 'assets/tilemaps/tiles/testerSet.png');
        this.load.image('player', 'assets/sprites/player.png');
        this.load.tilemapTiledJSON('map', 'assets/tilemaps/data/testerTilemap.json');
        this.load.audio('background', 'assets/music/background.wav');
    }

    create() {
        // Produce static map elements
        // Note: tileSize at 32. Variable allows up/down-scaling.
        const map = this.make.tilemap({ key: 'map' });
        const tileset = map.addTilesetImage('testerSet', 'tiles');
        var layer = map.createStaticLayer('Tile Layer 1', tileset);
        layer.setCollisionByProperty({ collides: true});
       
        // Produce key meanings
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keySHIFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
        
        var music = this.sound.add('background');
        music.setLoop(true);
        music.play();
        // Add in the player
        // this.p1Spawn = map.find();
        this.player = new Player(this, tileSize * 2, tileSize * 2, 'player').setOrigin(0);

        // Add in the moving tiles


    }

    update(time, delta) {
        this.player.update()
        // this.movingBlocks.update() ?
    }
}