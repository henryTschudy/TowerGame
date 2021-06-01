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
        this.cameras.main.fadeOut(0);
    }

    create() {
        this.playScene = this.scene.get("playScene");
        this.hudScene = this.scene.get("hudScene");
        this.returning = false;

        this.menu = this.add.image(0, 0, 'splash').setOrigin(0,0).setDepth(-1);
        this.play = this.add.sprite(144, roomHeight-61, 'playHover');
        this.help = this.add.sprite(roomWidth-155, roomHeight-61, 'helpEmpty');
        this.cameras.main.setBounds(0, 0, roomWidth, roomHeight);
        this.currentSelect = "play";

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
                //Play select sound
                this.time.delayedCall(750, () => {
                    this.cameras.main.fadeOut(100)
                    if(this.returning){
                        this.hudScene.scene.restart();
                        this.playScene.scene.restart();
                    }
                    this.time.delayedCall(100, () => {this.scene.start('playScene')});
                });
                
            }
            else {
                this.help.setTexture('helpHit');
                //Play select sound
                this.time.delayedCall(750, () => {
                    this.cameras.main.fadeOut(100)
                    this.time.delayedCall(100, () =>{this.scene.start('helpScene')});
                });
            }
        }
        if (Phaser.Input.Keyboard.JustDown(keyA)){
            if (this.currentSelect == "help"){
                //Play blip sound
                this.play.setTexture('playHover');
                this.help.setTexture('helpEmpty');
                this.currentSelect = "play";
            }
        }
        if (Phaser.Input.Keyboard.JustDown(keyD)){
            if (this.currentSelect == "play"){
                //Play blip sound
                this.play.setTexture('playEmpty');
                this.help.setTexture('helpHover');
                this.currentSelect = "help";
            }
        }
    }
}