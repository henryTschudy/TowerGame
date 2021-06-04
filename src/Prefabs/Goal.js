class Goal extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, sprite) {
        super(scene, x, y, sprite); 
        scene.add.existing(this);

        this.isAcive = false;

        this.anims.create({
            key: 'idle',
            frames:this.anims.generateFrameNames('goal', { zeroPad: 0, frames: ['goal1', 'goal2', 'goal3', 'goal2']}),
            frameRate: frameRate
        });

        this.anims.create({
            key: 'idleWhite',
            frames:this.anims.generateFrameNames('goal', { zeroPad: 0, frames: ['goal1White', 'goal2White', 'goal3White', 'goal2White']}),
            frameRate: frameRate
        });
    }
}