class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        this.load.image('splash', './assets/Splash/menu.png');
        this.load.image('playEmpty', './assets/Splash/playEmpty.png');
        this.load.image('playHover', './assets/Splash/playHover.png');
        this.load.image('playHit', './assets/Splash/playHit.png');
        this.load.image('helpEmpty', './assets/Splash/helpEmpty.png');
        this.load.image('helpHover', './assets/Splash/helpHover.png');
        this.load.image('helpHit', './assets/Splash/helpHit.png');
        this.load.image('help1', './assets/Splash/help1.png');
        this.load.image('help2', './assets/Splash/help1.png');
        this.load.audio('menuConfirm', './assets/music/menuconfirm.wav');
        this.load.audio('menuSelect', './assets/music/menuselect.wav');
        this.cameras.main.fadeOut(0);
    }

    create() {
        this.scene.stop("hudScene");
        this.scene.stop("playScene");

        console.log(this.scene.get("hudScene"))
        console.log(this.scene.get("playScene"))

        this.menu = this.add.image(0, 0, 'splash').setOrigin(0,0).setDepth(-1);
        this.play = this.add.sprite(144, roomHeight-61, 'playHover');
        this.help = this.add.sprite(roomWidth-155, roomHeight-61, 'helpEmpty');
        this.cameras.main.setBounds(0, 0, roomWidth, roomHeight);
        this.currentSelect = "play";

        this.selectSound = this.sound.add('menuSelect');
        this.confirmSound = this.sound.add('menuConfirm');

        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        
        this.time.delayedCall(750, () => {
            this.cameras.main.fadeIn(1000);
        });
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keySPACE)) {
            if(this.currentSelect == "play"){
                this.play.setTexture('playHit');
                this.confirmSound.play();
                this.time.delayedCall(750, () => {
                    this.cameras.main.fadeOut(100)
                    this.time.delayedCall(100, () => {this.scene.start('playScene')});
                });
                
            }
            else {
                this.help.setTexture('helpHit');
                this.confirmSound.play();
                this.time.delayedCall(750, () => {
                    this.cameras.main.fadeOut(100)
                    this.time.delayedCall(100, () =>{this.scene.start('helpScene')});
                });
            }
        }
        if (Phaser.Input.Keyboard.JustDown(keyA)){
            if (this.currentSelect == "help"){
                this.selectSound.play();
                this.play.setTexture('playHover');
                this.help.setTexture('helpEmpty');
                this.currentSelect = "play";
            }
        }
        if (Phaser.Input.Keyboard.JustDown(keyD)){
            if (this.currentSelect == "play"){
                this.selectSound.play();
                this.play.setTexture('playEmpty');
                this.help.setTexture('helpHover');
                this.currentSelect = "help";
            }
        }
    }
}