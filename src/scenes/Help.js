class Help extends Phaser.Scene {
    constructor() {
        super("helpScene");
    }

    preload() {
        this.load.image('help1', './assets/Splash/help1.png');
        this.load.image('help2', './assets/Splash/help2.png');
        this.cameras.main.fadeOut(0);
    }

    create() {
        this.helpImage = this.add.image(0, 0, 'help1').setOrigin(0,0).setDepth(-1);
        this.cameras.main.setBounds(0, 0, roomWidth, roomHeight);

        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        
        this.time.delayedCall(750, () => {
            this.cameras.main.fadeIn(1000);
        });
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keySPACE)) {
                this.helpImage.setTexture('help2');
                //Play select sound
                this.time.delayedCall(750, () => {
                    this.cameras.main.fadeOut(100)
                    this.time.delayedCall(100, () => {this.scene.start('menuScene')
                });
            });
        }
    }
}
