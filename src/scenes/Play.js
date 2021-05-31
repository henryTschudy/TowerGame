class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // Tilemap file is actually 576 x ~4000 some in size. The latter is so we can scroll/warp between levels.
        this.load.image('tiles', './assets/tilemaps/tiles/FinalTiles_-_Atlas.png');
        this.load.image('tiles', './assets/tilemaps/tiles/FinalTiles_-_Atlas_Black.png');
        this.load.image('pause', './assets/Splash/pause.png');
        this.load.atlas('player', './assets/sprites/AnimationSprites.png', './assets/sprites/walkSprite.json');
        this.load.atlas('goal', './assets/sprites/goal.png', './assets/sprites/goalSprite.json');
        this.load.tilemapTiledJSON('map', './assets/tilemaps/data/finalTilemap.json');
        this.load.audio('background', './assets/music/background.wav');
        this.load.audio('ambient', './assets/music/ambient.mp3');
    }

    create() {
        // Produce static map elements
        // Note: tileSize at 32. Variable allows up/down-scaling.
        const map = this.add.tilemap('map');
        const tileset = map.addTilesetImage('FinalTiles_-_Atlas', 'tiles');
        const tilelayer = map.createLayer('Tiles', tileset, 0, 0);
        const debrisLayer = map.createLayer('Debris', tileset, 0, 0);
        const wallLayer = map.createLayer('Walls', tileset, 0, 0);
        const objs = map.createLayer('Objs', tileset, 0, 0);
        
        this.map = map;
        this.wallLayer = wallLayer;

        this.p1Spawn = map.findObject('Objs', obj => obj.name === 'p1Spawn');
        this.p1Exit = map.findObject('Objs', obj => obj.name === 'p1Exit');
        this.r1Spawn = map.findObject('Objs', obj => obj.name === 'r1Spawn');
        this.r1Exit = map.findObject('Objs', obj => obj.name === 'r1Exit');
        this.r2Spawn = map.findObject('Objs', obj => obj.name === 'r2Spawn');
        this.r2Exit = map.findObject('Objs', obj => obj.name === 'r2Exit');
        this.r3Spawn = map.findObject('Objs', obj => obj.name === 'r3Spawn');
        this.r3Exit = map.findObject('Objs', obj => obj.name === 'r3Exit');
        this.r4Spawn = map.findObject('Objs', obj => obj.name === 'r4Spawn');
        this.r4Exit = map.findObject('Objs', obj => obj.name === 'r4Exit');
        this.r5Spawn = map.findObject('Objs', obj => obj.name === 'r5Spawn');
        this.r5Exit = map.findObject('Objs', obj => obj.name === 'r5Exit');
        this.p2Spawn = map.findObject('Objs', obj => obj.name === 'p2Spawn');
        this.p2Exit = map.findObject('Objs', obj => obj.name === 'p2Exit');

        this.spawns = [this.p1Spawn, this.r1Spawn, this.r2Spawn, this.r3Spawn, this.r4Spawn, this.r5Spawn, this.p2Spawn];
        this.exits = [this.p1Exit, this.r1Exit, this.r2Exit, this.r3Exit, this.r4Exit, this.r5Exit];
        this.roomNumber = 0;

        this.cameras.main.setScroll(0, (6) * roomHeight);

        this.deathEnabled = false;
        this.transitioning = true;
       
        // Produce key meanings
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keySHIFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
        keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        
        // Set world and camera bounds.
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        // NOTE : MOVE CAMERA TO 
        // We'll probably determine how the player is Out Of Bounds another way. Since it causes death.
        // this.phsyics.world.bounds.setTo(0, 0, map.widthInPixels, map.heightInPixels);

        // Add music
        this.music = this.sound.add('background');
        this.music.setLoop(true);
        this.music.play();

        this.music = this.sound.add('ambient');
        this.music.setLoop(true);
        this.music.play();

        // Add in the player
        this.player = new Player(this, this.p1Spawn.x, this.p1Spawn.y, 'player').setOrigin(0);
        this.player.setSize(30,30);
        this.transitioning = false;

        this.goal = this.add.sprite(this.p2Exit.x+16, this.p2Exit.y, 'goal');

        this.goal.anims.create({
            key: 'idle',
            frames:this.goal.anims.generateFrameNames('goal', { zeroPad: 0, frames: ['goal1', 'goal2', 'goal3']}),
            frameRate: frameRate
        })

        this.goal.anims.create({
            key: 'idleWhite',
            frames:this.goal.anims.generateFrameNames('goal', { zeroPad: 0, frames: ['goal1White', 'goal2White', 'goal3White']}),
            frameRate: frameRate
        })

        this.goal.anims.play('idle', true);

        // Collision
        wallLayer.setCollisionByProperty({ collides: true });
        this.physics.add.collider(this.player, wallLayer);

        // Playtest puzzle testing camera scroll, 0 being start, 7 being the end room.
        this.cameras.main.setScroll(0, (6) * roomHeight);
        this.cameras.main.fadeIn(1000);

        
    }

    roomScroll(cam, room){
        this.transitioning = true;
        cam.fadeOut(500);
        this.time.delayedCall(500, () => {
            cam.setScroll(0, (7 - room) * roomHeight);
            cam.fadeIn(500)
            this.time.delayedCall(100, () => this.transitioning = false);
        });
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyESC)){
            this.scene.pause();
            if (Phaser.Input.Keyboard.JustDown(keyESC)){
                this.scene.resume();
            }
            if (Phaser.Input.Keyboard.JustDown(keySPACE)){
                //Play exit sound.
                this.time.delayedCall(750, () => {
                    this.cameras.main.fadeOut(100);
                    this.time.delayedCall(100, () =>{
                        this.scene.start("menuScene");
                    });
                });
            }
        }
         if (!this.transitioning){
            if(tpLength >= 6 && !this.cameras.main.worldView.contains(this.player.x, this.player.y)) {
                console.log('A winner is you!');
            }
            else{
                this.player.update();
            }           
            if (keySPACE.isDown && this.roomNumber < 6 && this.player.isCollidedWith(this.exits[this.roomNumber])) {
                console.log("To Next Level");
                this.deathEnabled = false;
                if(this.roomNumber > tpLength - 2){
                    this.roomScroll(this.cameras.main, 7);
                    this.player.x = this.spawns[6].x;
                    this.player.y = this.spawns[6].y;
                    this.roomNumber = 6;
                }
                else{
                    this.roomNumber++;
                    this.roomScroll(this.cameras.main, this.roomNumber + 1);
                    this.player.x = this.spawns[this.roomNumber].x;
                    this.player.y = this.spawns[this.roomNumber].y;
                }
            }
            else if(keySPACE.isDown && this.deathEnabled && this.player.isCollidedWith(this.p2Exit)){
                this.player.controlLock = true;
                this.player.collisionOff = true;
                this.goal.anims.play('idelWhite', true);
                this.deathEnabled = false;
                //this.cameras.main.shake(duration, 0.01);
                this.player.body.setVelocityY(-15);
                this.time.delayedCall(2500, () => {
                    this.player.body.setVelocityY(0);
                    this.player.anims.play('teleport', false);
                });
                this.time.delayedCall(3000, () => {
                    this.roomNumber = 0;
                    this.player.x = this.spawns[0].x;
                    this.player.y = this.spawns[0].y;
                    this.roomScroll(this.cameras.main, this.roomNumber + 1);
                    this.player.exitTeleport(true);
                    if(tpLength < 6){
                        ++tpLength;
                    }
                });
            } else if (keySPACE.isDown && this.roomNumber < 6 && (this.player.isCollidedWith(this.spawns[this.roomNumber]) && !this.player.isCollidedWith(this.p1Spawn))) {
                console.log("To previous Level");
                this.deathEnabled = false;
                this.roomNumber--;
                this.roomScroll(this.cameras.main, this.roomNumber - 1);
                this.player.x = this.exits[this.roomNumber].x-16;
                this.player.y = this.exits[this.roomNumber].y-16;
                }
        }
    }
}