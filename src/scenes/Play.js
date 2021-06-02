class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // Tilemap file is actually 576 x ~4000 some in size. The latter is so we can scroll/warp between levels.
        this.load.image('tiles', './assets/tilemaps/tiles/FinalTiles_-_Atlas.png');
        this.load.image('tiles2', './assets/tilemaps/tiles/FinalTiles_-_Atlas_Black.png');
        this.load.atlas('player', './assets/sprites/AnimationSprites.png', './assets/sprites/walkSprite.json');
        this.load.atlas('goal', './assets/sprites/goal.png', './assets/sprites/goalSprite.json');
        this.load.tilemapTiledJSON('map', './assets/tilemaps/data/finalTilemap.json');
        this.load.audio('background', './assets/music/background.wav');
        this.load.audio('die', './assets/music/die.wav');
        this.load.audio('pause', './assets/music/pause.wav');
        this.load.audio('powerUp', './assets/music/powerup.wav');
        this.load.audio('stairsDown', './assets/music/stairsdown.wav');
        this.load.audio('stairsUp', './assets/music/stairsup.wav');
        this.load.audio('step', './assets/music/step.wav');
        this.load.audio('TPIn', './assets/music/tpin.wav');
        this.load.audio('TPOut', './assets/music/tpout.wav');
    }

    create() {
        this.scene.launch("hudScene");
        this.scene.moveAbove("playScene", "hudScene");

        this.hudScene = this.scene.get("hudScene");
        
        try{
            this.cameras.main.fadeOut(0);
            this.hudScene.cameras.main.fadeOut(0);
        }
        catch (e) {} // Suppress a specific, weird error that doesn't effect the game.
        // Produce static map elements
        // Note: tileSize at 32. Variable allows up/down-scaling.
        const map = this.add.tilemap('map');
        const tileset = map.addTilesetImage('FinalTiles_-_Atlas', 'tiles2');
        const tilelayer = map.createLayer('Tiles', tileset, 0, 0);
        const debrisLayer = map.createLayer('Debris', tileset, 0, 0);
        const wallLayer = map.createLayer('Walls', tileset, 0, 0);
        const objs = map.createLayer('Objs', tileset, 0, 0);

        this.map = map;
        this.wallLayer = wallLayer;

        this.p1Spawn = map.findObject('Objs', obj => obj.name === 'p1Spawn');
        this.p1Exit = map.findObject('Objs', obj => obj.name === 'p1Exit');
        this.p1Window = map.findObject('Objs', obj => obj.name === 'p1Window')
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
        this.ghosted = false;
        this.victory = false;
       
        // Produce key meanings
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keySHIFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
        keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyZERO = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ZERO);
        
        // Set world and camera bounds.
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        // NOTE : MOVE CAMERA TO 
        // We'll probably determine how the player is Out Of Bounds another way. Since it causes death.
        // this.phsyics.world.bounds.setTo(0, 0, map.widthInPixels, map.heightInPixels);

        // Add music
        this.music = this.sound.add('background');
        this.music.setLoop(true);
        this.music.play();

        this.pauseSound = this.sound.add('pause');
        this.upSound = this.sound.add('stairsUp');
        this.powerUpSound = this.sound.add('powerUp');
        this.downSound = this.sound.add('stairsDown');

        this.goal = new Goal(this, this.p2Exit.x, this.p2Exit.y-32, 'goal');

        this.windowGlow = this.add.sprite(this.p1Window.x, this.p1Window.y, 'goal');
        this.windowGlow.anims.create({
            key: 'active', 
            frames:this.anims.generateFrameNames('goal', { zeroPad: 0, frames: ['light1', 'light2']}),
            frameRate: frameRate/2
        });
        this.windowGlow.anims.create({
            key: 'idle', 
            frames:this.anims.generateFrameNames('goal', { zeroPad: 0, frames: ['light1']}),
            frameRate: frameRate/2
        });

        // Add in the player
        this.player = new Player(this, this.p1Spawn.x, this.p1Spawn.y, 'player').setOrigin(0);
        this.player.setSize(30,30);
        this.transitioning = false;

        // Collision
        wallLayer.setCollisionByProperty({ collides: true });
        this.physics.add.collider(this.player, this.wallLayer);

        // Playtest puzzle testing camera scroll, 0 being start, 7 being the end room.
        this.cameras.main.setScroll(0, (6) * roomHeight);
        this.cameras.main.fadeIn(1000);
        this.hudScene.cameras.main.fadeIn(1000);
        this.time.delayedCall(500, () => this.uiToggle())
    }

    uiToggle(duration=3000){
        this.hudScene.showUI();
        this.time.delayedCall(duration, () => this.hudScene.hideUI());
    }

    roomScroll(cam, room){
        this.transitioning = true;
        cam.fadeOut(500);
        this.hudScene.cameras.main.fadeOut(500);
        this.time.delayedCall(500, () => {
            cam.setScroll(0, (7 - room) * roomHeight);
            cam.fadeIn(500)
            this.hudScene.cameras.main.fadeIn(500)
            this.time.delayedCall(100, () => {
                this.transitioning = false
                this.uiToggle();
            });
        });
    }

    update() {
        if(!this.victory){
            this.windowGlow.anims.play('idle', true);
        } else {
            this.windowGlow.anims.play('active', true);
        }
        if (!this.goal.isActive){
            this.goal.anims.play('idle', true);
        }
        if (Phaser.Input.Keyboard.JustDown(keyESC)){
            this.pauseSound.play();
            this.hudScene.isPaused = true;
            this.hudScene.pause.setAlpha(1);
            this.scene.pause();
        }
         if (!this.transitioning){
            if(tpLength >= 6 && !this.cameras.main.worldView.contains(this.player.x, this.player.y)) {
                if(this.ghosted){
                    // ur a dead boy even though you escaped
                    // Alternate ending not yet implemented though
                    // set alt end variable here
                    this.victory = true;
                }
                else{
                    this.victory = true;
                }
            }
            else{
                this.player.update();
            }           
            if (keySPACE.isDown && this.roomNumber < 6 && this.player.isCollidedWith(this.exits[this.roomNumber])) {
                this.upSound.play();
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
                this.player.isMoving = false;
                this.player.setVelocity(0, 0);
                if(this.player.y % 32 != 0){
                    if(this.player.y % 32 > 16){
                        this.player.y += 32 - (this.player.y % 32)
                    }
                    else{
                        this.player.y -= this.player.y % 32
                    }
                }
                this.physics.world.colliders.destroy();
                this.goal.isActive = true;
                this.goal.anims.play('idleWhite', true);
                this.deathEnabled = false;
                this.cameras.main.shake(3000, 0.01);
                this.powerUpSound.play();
                this.player.body.setVelocityY(-15);
                this.time.delayedCall(2500, () => {
                    this.player.body.setVelocityY(0);
                    this.physics.add.collider(this.player, this.wallLayer);
                    this.player.anims.play('teleport', false);
                });
                this.time.delayedCall(3000, () => {
                    this.roomNumber = 0;
                    this.player.x = this.spawns[0].x;
                    this.player.y = this.spawns[0].y;
                    this.roomScroll(this.cameras.main, this.roomNumber + 1);
                    this.player.exitTeleport(true);
                    this.goal.isActive = false;
                    if(tpLength < 6){
                        ++tpLength;
                    }
                });
            } else if (keySPACE.isDown && this.roomNumber < 6 && (this.player.isCollidedWith(this.spawns[this.roomNumber]) && !this.player.isCollidedWith(this.p1Spawn))) {
                this.deathEnabled = false;
                this.downSound.play();
                this.roomNumber--;
                this.roomScroll(this.cameras.main, this.roomNumber - 1);
                this.player.x = this.exits[this.roomNumber].x-16;
                this.player.y = this.exits[this.roomNumber].y-16;
            }
            else if (Phaser.Input.Keyboard.JustDown(keySPACE) && this.player.isCollidedWith(this.p1Window)){
                this.player.controlLock = true;
                this.cameras.main.fadeOut(1000);
                this.hudScene.cameras.main.fadeOut(1000);
                this.time.delayedCall(1000, () => {
                    this.hudScene.outsideImage.setAlpha(1);
                    this.hudScene.maskImage.setAlpha(1);
                    this.cameras.main.fadeIn(1000);
                    this.hudScene.cameras.main.fadeIn(1000);
                    this.time.delayedCall(1000, () => {
                        this.tweens.add({
                            targets: this.hudScene.outsideImage,
                            y: 50,
                            duration: 4000
                        });
                    });
                    this.time.delayedCall(4000, () => {
                        this.cameras.main.fadeOut(1000);
                        this.hudScene.cameras.main.fadeOut(1000);
                        this.time.delayedCall(1000, () => {
                            this.hudScene.outsideImage.setAlpha(0);
                            this.hudScene.maskImage.setAlpha(0);
                            this.tweens.add({
                                targets: this.hudScene.outsideImage,
                                y: 0,
                                duration: 0
                            });
                            this.cameras.main.fadeIn(1000);
                            this.hudScene.cameras.main.fadeIn(1000);
                            this.player.controlLock = false;
                        });
                    })
                })
                // Run code for showing outside
                if(this.victory){
                    this.player.anims.play('teleport', false);
                    this.cameras.main.fadeOut(1000);
                    this.time.delayedCall(100, () => {this.scene.start('goodEnding');} );
                }
            }
        }
    }
}