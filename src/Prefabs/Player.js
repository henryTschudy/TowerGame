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
        this.walkSpeed = 8;
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
            // Emit particles to tell the player theyre in teleport mode
            if (Phaser.Input.Keyboard.JustDown(keyA)){
                // Emit TP particles where player is before tp here
                this.x -= tileSize * tpLength;
            }
            else if (Phaser.Input.Keyboard.JustDown(keyD)){
                // Follow above particle stuff for the following
                this.x += tileSize * tpLength;
            }
            else if (Phaser.Input.Keyboard.JustDown(keyW)){            
                this.y -= tileSize * tpLength;
            }
            else if (Phaser.Input.Keyboard.JustDown(keyS)){
                this.y += tileSize * tpLength;
            }
        }
        else{
            if (keyA.isDown){
                if(!this.isMoving){
                    this.isMoving = true;
                    this.setVelocity(-tileSize * this.walkSpeed, 0);
                    // Something like this so that we move around in grid style
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
            else if (keyD.isDown){
                if (!this.isMoving) {
                    this.isMoving = true;
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
            else if (keyW.isDown){
                while(!this.isMoving){
                    this.isMoving = true;
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
            else if (keyS.isDown){
                while(!this.isMoving){
                    this.isMoving = true;
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
        }
 
        // Collision logic handled in Play.js
    }
}