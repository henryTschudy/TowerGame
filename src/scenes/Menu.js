class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        this.load.image('splash', './assets/Splash/SplashBackground.jpg')
        this.cameras.main.fadeOut(0);
    }

    create() {
        this.add.image(0, 0, 'splash');
        this.cameras.main.setBounds(0, 0, roomWidth, roomHeight)
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
            this.scene.start('playScene')
        })
        
        this.time.delayedCall(750, () => {
            this.cameras.main.fadeIn(1000);
        });
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keySPACE)){
            this.cameras.main.fadeOut(100);
        }
    }
}