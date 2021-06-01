class goodEnding extends Phaser.Scene {
    constructor() {
        super("goodEnding");
    }

    preload() {
        this.cameras.main.fadeOut(0);
        this.load.image('placeholder', './assets/Splash/TheThing.png');
    }
    create() {
        this.add.text(0, 0, 'The Good Ending')
        // this.endingImage = this.add.image(0, 0, 'placeholder').setOrigin(0,0).setDepth(-1);

        this.time.delayedCall(750, () => {
            this.cameras.main.fadeIn(1000);
        });
    }
}