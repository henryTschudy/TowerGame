class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, sprite) {
        // call Phaser Physics Sprite constructor
        super(scene, x, y, sprite); 
        
        // set up physics sprite
        scene.add.existing(this);               // add to existing scene, displayList, updateList
        scene.physics.add.existing(this);       // add to physics system
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
        if (Phaser.Input.Keyboard.JustDown(keyA)){
            this.x -= tileSize * tpLength;
            //this.angle = 180;
        }
        else if (Phaser.Input.Keyboard.JustDown(keyD)){
            this.x += tileSize * tpLength;
            //this.angle = 0;
        }
        else if (Phaser.Input.Keyboard.JustDown(keyW)){            
            this.y -= tileSize * tpLength;
            //this.angle = -90;
        }
        else if (Phaser.Input.Keyboard.JustDown(keyS)){
            this.y += tileSize * tpLength;
            //this.angle = 90;
        }
 
        // else -> move logic
 
        // Collision logic handled in Play.js
    }
}