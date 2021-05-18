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
        this.walkSpeed = 4;
    }

    sendToBottom () {
        ++tpLength;
    }

    playerDeath () {

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
            if (Phaser.Input.Keyboard.JustDown(keyA) && this.x >= this.width * tpLength){
                // Emit TP particles where player is before tp here
                this.x -= tileSize * tpLength;
                // Emit TP particles where player is after tp here
                //Added Player cannot collide with wall 
            }
            else if (Phaser.Input.Keyboard.JustDown(keyD) && this.x < gameSize - this.width * tpLength){
                // Follow above particle stuff for the following
                this.x += tileSize * tpLength;
                 //Added Player cannot collide with wall 
            }
            else if (Phaser.Input.Keyboard.JustDown(keyW) && this.y >= this.height * tpLength){            
                this.y -= tileSize * tpLength;
                //this.angle = -90;
                 //Added Player cannot collide with wall 
            }
            else if (Phaser.Input.Keyboard.JustDown(keyS) && this.y < gameSize - this.height * tpLength){
                this.y += tileSize * tpLength;
                //this.angle = 90;
                 //Added Player cannot collide with wall 
            }
        }
        else{
            // Emit particles to tell the player theyre in teleport mode
            if (Phaser.Input.Keyboard.JustDown(keyA) && !this.isMoving && this.x >= this.width){
                this.isMoving = true;
                this.setVelocity(-tileSize * this.walkSpeed, 0);
                // Something like this so that we move around in grid style
                this.scene.time.delayedCall(1000 / this.walkSpeed, () => {
                    this.isMoving = false;
                    this.setVelocity(0, 0);
                });
            }
            else if (Phaser.Input.Keyboard.JustDown(keyD) && !this.isMoving && this.x < gameSize - this.width){
                this.isMoving = true;
                this.setVelocity(tileSize * this.walkSpeed, 0);
                this.scene.time.delayedCall(1000 / this.walkSpeed, () => {
                    this.isMoving = false;
                    this.setVelocity(0, 0);
                });
            }
            else if (Phaser.Input.Keyboard.JustDown(keyW) && !this.isMoving && this.y >= this.height){            
                this.isMoving = true;
                this.setVelocity(0, -tileSize * this.walkSpeed);
                this.scene.time.delayedCall(1000 / this.walkSpeed, () => {
                    this.isMoving = false;
                    this.setVelocity(0, 0);
                });
            }
            else if (Phaser.Input.Keyboard.JustDown(keyS) && !this.isMoving && this.y < gameSize - this.height){
                this.isMoving = true;
                this.setVelocity(0, tileSize * this.walkSpeed);
                this.scene.time.delayedCall(1000 / this.walkSpeed, () => {
                    this.isMoving = false;
                    this.setVelocity(0, 0);
                });
            }
        }
 
        // Collision logic handled in Play.js
    }
}