class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        this.load.spritesheet('splash', './assets/Splash/menu.png', {frameWidth: 576, frameHeight: 608, startFrame: 0, endFrame: 2});
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
        //this.load.audio('menuMusic', './assets/music/');
        this.cameras.main.fadeOut(0);
    }

    create() {
        this.scene.stop("hudScene");
        this.scene.stop("playScene");

        this.anims.create({
            key: 'menuAnim',
            frames: this.anims.generateFrameNumbers('splash', { zeroPad: 0, frames: [0, 1, 2, 0, 1, 2, 1, 0, 2, 1]}),
            frameRate: frameRate
        });

        this.menu = this.add.sprite(0, 0, 'splash').setOrigin(0,0).setDepth(-1);
        this.play = this.add.sprite(144, roomHeight-61, 'playHover');
        this.help = this.add.sprite(roomWidth-155, roomHeight-61, 'helpEmpty');
        this.cameras.main.setBounds(0, 0, roomWidth, roomHeight);
        this.currentSelect = "play";

        this.selectSound = this.sound.add('menuSelect');
        this.confirmSound = this.sound.add('menuConfirm');
        this.music = this.sound.add('menuMusic');

        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        
        this.time.delayedCall(750, () => {
            this.cameras.main.fadeIn(1000);
        });
    }

    update() {
        this.menu.anims.play('menuAnim', true)
        if (Phaser.Input.Keyboard.JustDown(keySPACE)) {
            if(this.currentSelect == "play"){
                this.play.setTexture('playHit');
                this.confirmSound.play();
                this.time.delayedCall(750, () => {
                    //this.tweens.add({
                        //targets:  this.music,
                        //volume:   0,
                        //duration: 100
                    //});
                    this.cameras.main.fadeOut(100);
                    this.time.delayedCall(100, () => {this.scene.start('playScene')});
                });
                
            }
            else {
                this.help.setTexture('helpHit');
                this.confirmSound.play();
                this.time.delayedCall(750, () => {
                    this.cameras.main.fadeOut(100);
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