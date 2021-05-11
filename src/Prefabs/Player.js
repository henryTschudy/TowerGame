class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, sprite) {
        // call Phaser Physics Sprite constructor
        super(scene, x, y, sprite); 
        
        // set up physics sprite
        scene.add.existing(this);               // add to existing scene, displayList, updateList
        scene.physics.add.existing(this);       // add to physics system
    }

    // Give me a heads up if you want the time, delta part
    update() {
        // if keySHIFT -> teleport logic
        // else -> move logic
        // Collision logic handled in Play.js
    }
}