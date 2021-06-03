class goodEnding extends Phaser.Scene {
    constructor() {
        super("goodEnding");
    }

    preload() {
        this.cameras.main.fadeOut(0);
        this.load.atlas('finalAnimation', './assets/sprites/finalAnimation.png', './assets/sprites/finalAnimation.json');
        this.playScene = this.scene.get("playScene");
    }
    create() {
        this.endScene = this.add.image(0, 0, 'endScene').setOrigin(0,0);

        this.anims.create({
            key: 'endSceneAnim',
            frames: this.anims.generateFrameNumbers('finalAnimation', { prefix: 'frame', end: 52, zeroPad: 2}),
            frameRate: frameRate
        });

        this.time.delayedCall(750, () => {
            this.cameras.main.fadeIn(1000);
        });
        this.anims.play('endSceneAnim', false);
        this.time.delayedCall(3000, () => {
            this.camera.main.fadeOut(3000)
            this.time.delayedCall(3000, () => {
                this.playScene.scene.stop();
                this.scene.start("menuScene");
                this.playScene.scene.sendToBack();
                this.playScene.scene.restart();
                tpLength = 2;
            })
        })
    }
}