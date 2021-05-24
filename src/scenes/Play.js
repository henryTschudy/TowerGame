class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // Tilemap file is actually 576 x ~4000 some in size. The latter is so we can scroll/warp between levels.
        this.load.image('tiles', './assets/tilemaps/tiles/FinalTiles_-_Atlas.png');
        this.load.image('player', './assets/sprites/player.png');
        this.load.tilemapTiledJSON('map', './assets/tilemaps/data/finalTilemap.json');
        this.load.audio('background', './assets/music/background.wav');
    }

    create() {
        // Produce static map elements
        // Note: tileSize at 32. Variable allows up/down-scaling.
        const map = this.add.tilemap('map');
        const tileset = map.addTilesetImage('FinalTiles_-_Atlas', 'tiles');
        const tilelayer = map.createLayer('Tiles', tileset, 0, 0);
        const wallLayer = map.createLayer('Walls', tileset, 0, 0);
        //const p1Spawn = map.findObject('Objs', obj => obj.name === 'p1Spawn') || { x: 32, y: 3968};
        //TODO: Add const lvlExit to be read from JSON

        /*
            TODO: THE VARS BELOW ARE TEMPORARY, HAVE THEM BE READ BY JSON ABOVE
        */
        this.p1Spawn = { x: 288, y: 2912 };
        this.lvlExit = { x: 512, y: 3040 };
        this.wonLvl = false;

        this.deathEnabled = false;

        this.time.delayedCall(100, () => this.deathEnabled = true);
        // findObject is drunk :(
        // console.log(this.p1Spawn);
        // console.log(this.p1Spawn.x);
        // console.log(this.p1Spawn.y);
       
        // Produce key meanings
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keySHIFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
        
        // Set world and camera bounds.
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        // NOTE : MOVE CAMERA TO 
        // We'll probably determine how the player is Out Of Bounds another way. Since it causes death.
        // this.phsyics.world.bounds.setTo(0, 0, map.widthInPixels, map.heightInPixels);

        // Add music
        var music = this.sound.add('background');
        music.setLoop(true);
        music.play();

        // Add in the player - NOTE : hardcoded items copied and pasted from js file because findObject ate too many crayons today and keeps saying p1Spawn is undef
        this.player = new Player(this, 288, 2912, 'player').setOrigin(0);
        // this.player = new Player(this, this.p1Spawn.x, this.p1Spawn.y, 'player').setOrigin(0);

        // Add in the moving tiles

        // Collision
        wallLayer.setCollisionByProperty({ collides: true });
        tilelayer.setCollisionByProperty({ collides: true });
        this.physics.add.collider(this.player, wallLayer, () => {
            //TODO: what happens when player hits wall
            console.log("Player hit wall");
            this.player.playerDeath(this.p1Spawn.x, this.p1Spawn.y); 
        });
        // this.physics.add.overlap(this.player, wallLayer, () => {
        //     console.log("Player hit wall");
        //     this.player.playerDeath(this.p1Spawn.x, this.p1Spawn.y); 
        // }); // Use to check if player is overlapping a wall

        // Playtest puzzle testing camera scroll, 0 being start, 7 being the end room.
        this.ptestdbgScrollCam(this.cameras.main, 2)
    }

    ptestdbgScrollCam(cam, room){
        this.cameras.main.setScroll(0, (7 - room) * 576);
    }

    update(time, delta) {
        this.player.update();

        // If player is off camera && levelSwitch != true : Kill
        // Thanks to : https://phaser.discourse.group/t/what-is-incamera-in-phaser-3/7031
        // If player is overlapping bad tile : Kill
        // if(this.player.touching.???){ this.player.playerDeath }
        if(!this.cameras.main.worldView.contains(this.player.x, this.player.y) && this.deathEnabled) { // Boolean set to be always false. Replace with bad player location overlaps.
            music.stop();
            this.player.playerDeath(this.p1Spawn.x, this.p1Spawn.y);
        }
        // this.movingBlocks.update() ?

        if (this.player.isCollidedWith(this.lvlExit) && !this.wonLvl) {
            //TODO: Go to next level
            console.log("To Next Level");
            this.wonLvl = true;
        }
    }
}