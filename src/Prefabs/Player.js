class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, sprite) {
        // call Phaser Physics Sprite constructor
        super(scene, x, y, sprite); 
        
        // set up physics sprite
        scene.add.existing(this);               // add to existing scene, displayList, updateList
        scene.physics.add.existing(this);       // add to physics system
        this.isMoving = false;
        this.width = 32;
        this.height =32;
        this.walkSpeed = 5;
        this.justTeleported;
        this.animationFramerate = 5;
        this.controlLock = false;

        this.anims.create({
            key: 'standForward',
            frames:this.anims.generateFrameNames('player', { zeroPad: 0, frames: ['standForward']}),
            frameRate: this.animationFramerate,
            repeat: -1
        })

        this.anims.create({
            key: 'walkForward',
            frames:this.anims.generateFrameNames('player', { zeroPad: 0, frames: ['standForward', 'walkForward1', 'standForward', 'walkForward2']}),
            frameRate: this.animationFramerate,
            skipMissedFrames: false,
            repeat: -1
        })

        this.anims.create({
            key: 'standLeft',
            frames:this.anims.generateFrameNames('player', { zeroPad: 0, frames: ['standLeft']}),
            frameRate: this.animationFramerate,
            repeat: -1
        })

        this.anims.create({
            key: 'walkLeft',
            frames:this.anims.generateFrameNames('player', { zeroPad: 0, frames: ['standLeft', 'walkLeft1', 'standLeft', 'walkLeft2']}),
            frameRate: this.animationFramerate,
            skipMissedFrames: false,
            repeat: -1
        })

        this.anims.create({
            key: 'standRight',
            frames:this.anims.generateFrameNames('player', { zeroPad: 0, frames: ['standRight']}),
            frameRate: this.animationFramerate,
            repeat: -1
        })

        this.anims.create({
            key: 'walkRight',
            frames:this.anims.generateFrameNames('player', { zeroPad: 0, frames: ['standRight', 'walkRight1', 'standRight', 'walkRight2']}),
            frameRate: this.animationFramerate,
            skipMissedFrames: false,
            repeat: -1
        })

        this.anims.create({
            key: 'standBackward',
            frames:this.anims.generateFrameNames('player', { zeroPad: 0, frames: ['standBackward']}),
            frameRate: this.animationFramerate,
            repeat: -1
        })

        this.anims.create({
            key: 'walkBackward',
            frames:this.anims.generateFrameNames('player', { zeroPad: 0, frames: ['standBackward', 'walkBackward1', 'standBackward', 'walkBackward2']}),
            frameRate: this.animationFramerate,
            skipMissedFrames: false,
            repeat: -1
        })

        this.anims.create({
            key: 'teleport',
            frames:this.anims.generateFrameNames('player', { zeroPad: 0, frames: ['standForward', 'teleport1', 'teleport2', 'teleport3', 'teleport4', 'teleport5']}),
            frameRate: this.animationFramerate*2,
            skipMissedFrames: false,
            repeat: 0
        })

    }

    playerDeath (x, y) {
        console.log('I am Dead!')
        this.x = x;
        this.y = y;
    }

    // Pass an object with x and y member variables, returns whether player and the object are colliding
    isCollidedWith(obj) {
        return Math.abs(this.x - obj.x) <= this.width && Math.abs(this.y - obj.y) <= this.height;
    }

    // I'll have to look a bit more into FSMs
    // setState() {
    // 
    // }
    // Give me a heads up if you want the time, delta part
    update() {
        // if keySHIFT and not walking -> teleport logic
        // Something like this, src : https://phaser.io/examples/v3/view/game-objects/lights/tilemap-layer
        if(keySHIFT.isDown){
            if (Phaser.Input.Keyboard.JustDown(keyA) && this.controlLock == false){
                this.controlLock = true;
                this.anims.play('teleport', false);
                this.scene.time.delayedCall(750, () => {
                    this.x -= tileSize * tpLength;
                    this.anims.playReverse('teleport', false);
                    this.controlLock = false;
                });
            }
            else if (Phaser.Input.Keyboard.JustDown(keyD) && this.controlLock == false){
                this.controlLock = true;
                this.anims.play('teleport', false);
                this.scene.time.delayedCall(750, () => {
                    this.x += tileSize * tpLength;
                    this.anims.playReverse('teleport', false);
                    this.controlLock = false;
                });
            }
            else if (Phaser.Input.Keyboard.JustDown(keyW) && this.controlLock == false){            
                this.controlLock = true;
                this.anims.play('teleport', false);
                this.scene.time.delayedCall(750, () => {
                    this.y -= tileSize * tpLength;
                    this.anims.playReverse('teleport', false);
                    this.controlLock = false;
                });
            }
            else if (Phaser.Input.Keyboard.JustDown(keyS) && this.controlLock == false){
                this.controlLock = true;
                this.anims.play('teleport', false);
                this.scene.time.delayedCall(750, () => {
                    this.y += tileSize * tpLength;
                    this.anims.playReverse('teleport', false);
                    this.controlLock = false;
                });
            }
        }
        else{
            if (keyA.isDown && this.controlLock == false){
                if(!this.isMoving){
                    this.isMoving = true;
                    this.anims.play('walkLeft', true);
                    this.setVelocity(-tileSize * this.walkSpeed, 0);
                    this.scene.time.delayedCall(1000 / this.walkSpeed, () => {
                        this.isMoving = false;
                        this.setVelocity(0, 0);
                        if(this.x % 32 != 0){
                            if(this.x % 32 > 16){
                                this.x += 32 - (this.x % 32)
                            }
                            else{
                                this.x -= this.x % 32
                            }
                        }
                    });
                }
            }
            else if (keyD.isDown && this.controlLock == false){
                if (!this.isMoving) {
                    this.isMoving = true;
                    this.anims.play('walkRight', true);
                    this.setVelocity(tileSize * this.walkSpeed, 0);
                    this.scene.time.delayedCall(1000 / this.walkSpeed, () => {
                        this.isMoving = false;
                        this.setVelocity(0, 0);
                        if(this.x % 32 != 0){
                            if(this.x % 32 > 16){
                                this.x += 32 - (this.x % 32)
                            }
                            else{
                                this.x -= this.x % 32
                            }
                        }
                    });
                }
            }
            else if (keyW.isDown && this.controlLock == false){
                while(!this.isMoving){
                    this.isMoving = true;
                    this.anims.play('walkBackward', true);
                    this.setVelocity(0, -tileSize * this.walkSpeed);
                    this.scene.time.delayedCall(1000 / this.walkSpeed, () => {
                        this.isMoving = false;
                        this.setVelocity(0, 0);
                        if(this.y % 32 != 0){
                            if(this.y % 32 > 16){
                                this.y += 32 - (this.y % 32)
                            }
                            else{
                                this.y -= this.y % 32
                            }
                        }
                    });
                }
            }
            else if (keyS.isDown && this.controlLock == false){
                while(!this.isMoving){
                    this.isMoving = true;
                    this.anims.play('walkForward', true);
                    this.setVelocity(0, tileSize * this.walkSpeed);
                    this.scene.time.delayedCall(1000 / this.walkSpeed, () => {
                        this.isMoving = false;
                        this.setVelocity(0, 0);
                        if(this.y % 32 != 0){
                            if(this.y % 32 > 16){
                                this.y += 32 - (this.y % 32)
                            }
                            else{
                                this.y -= this.y % 32
                            }
                        }
                    });
                }
            }
            else{
                this.anims.restart();
                this.anims.stop(null, true);
            }
        }
    }
}