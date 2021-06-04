class Hud extends Phaser.Scene {
    constructor() {
        super("hudScene");
    }
    
    preload() {
        this.load.image('ui', './assets/Splash/ui.png');
        this.load.image('pause', './assets/Splash/pause.png');
        this.load.image('outside', './assets/sprites/outside.png');
        this.load.image('mask', './assets/sprites/mask.png');
        this.load.audio('unpause', './assets/music/unpause.wav');
        this.load.audio('end', './assets/music/end.wav');
    }

    create () {
        this.playScene = this.scene.get("playScene");
        this.isPaused = false;

        this.unpauseSound = this.sound.add('unpause');
        this.endSound = this.sound.add('end')

        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.currentDistance = tpLength;

        let textConfig = {
            fontFamily: 'Courier New',
            fontSize: '20px',
            color: '#FFFFFF',
            align: 'left',
            fixedWidth: 0
        }

        let numConfig = {
            fontFamily: 'Courier New',
            fontSize: '60px',
            color: '#FFFFFF',
            align: 'left',
            fixedWidth: 0
        }

        this.pause = this.add.image(0, 0, "pause").setOrigin(0,0).setDepth(3);
        this.pause.setAlpha(0);

        this.uiSprite = this.add.image(0, 0, 'ui').setOrigin(0,0).setDepth(1);
        this.teleportText = this.add.text(roomWidth - 300, 5, 'Teleport Distance', textConfig).setOrigin(0).setDepth(2);
        this.number = this.add.text(roomWidth - 58, 15, tpLength, numConfig).setOrigin(0).setDepth(2);
    
        this.outsideImage = this.add.image(0,0,'outside').setOrigin(0,0);
        this.outsideImage.setAlpha(0);
        this.outsideImage.setDepth(4);

        this.maskImage = this.add.image(0,0,'mask').setOrigin(0,0);
        this.maskImage.setAlpha(0);
        this.maskImage.setDepth(5);
    }

    hideUI(){
        this.tweens.add({
            targets: this.uiSprite,
            y: 0-this.uiSprite.height,
            duration: 1000
        });
        this.tweens.add({
            targets: this.teleportText,
            y: 0-(this.uiSprite.height+5),
            duration: 1000
        });
        this.tweens.add({
            targets: this.number,
            y: 0-(this.uiSprite.height+15),
            duration: 1000
        });
    }

    showUI(){
        this.tweens.add({
            targets: this.uiSprite,
            y: 0,
            duration: 1000
        });
        this.tweens.add({
            targets: this.teleportText,
            y: 5,
            duration: 1000
        });
        this.tweens.add({
            targets: this.number,
            y: 15,
            duration: 1000
        });
    }

    update(){
        if (this.isPaused){
            if (Phaser.Input.Keyboard.JustDown(keySPACE)){
                this.endSound.play();
                this.time.delayedCall(750, () => {
                    this.isPaused = false;
                    this.cameras.main.fadeOut(500);
                    this.playScene.cameras.main.fadeOut(500);
                    this.time.delayedCall(500, () =>{
                        this.game.sound.stopAll();
                       // Will Leave this commented in case we want 
                        //to any any point attempt menu reset
                        // this.playScene.scene.stop();
                        // this.scene.start("menuScene");
                        // this.playScene.scene.sendToBack();
                        this.playScene.scene.restart();
                        tpLength = 2;
                    });
                });
            } else if (Phaser.Input.Keyboard.JustDown(keyESC)){
                this.unpauseSound.play();
                this.pause.setAlpha(0);
                this.isPaused = false;
                this.playScene.scene.resume();
            }
        }

        if (tpLength != this.currentDistance){
            this.time.delayedCall(750, () => this.number.text = tpLength);
        }
    }
}