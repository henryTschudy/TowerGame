class goodEnding extends Phaser.Scene {
    constructor() {
        super("goodEnding");
    }

    preload() {
        this.load.atlas('finalAnimation1', './assets/sprites/finalAnim1.png', './assets/sprites/finalAnim1.json');
        this.load.atlas('finalAnimation2', './assets/sprites/finalAnim2.png', './assets/sprites/finalAnim2.json');
        this.load.image('creditsImage', './assets/Splash/credits.png');
        //this.load.audio('menuMusic', './assets/music/');
        this.playScene = this.scene.get("playScene");
        this.cameras.main.fadeOut(0);
    }
    create() {
        this.endScene = this.add.sprite(0, 0, 'outside').setOrigin(0,0);
        this.creditsImage = this.add.image(0, 0, 'creditsImage').setOrigin(0, 0);
        this.creditsImage.setAlpha(0);
        //this.music = this.sound.add('menuMusic');

        this.anims.create({
            key: 'endSceneAnim1',
            frames: this.anims.generateFrameNames('finalAnimation1', {prefix: "frame", start: 0, end: 26, zeroPad: 0}),
            frameRate: frameRate
        });

        this.endScene.anims.create({
            key: 'endSceneAnim2',
            frames: this.anims.generateFrameNames('finalAnimation2', { prefix: 'frame', start: 27, end: 52, zeroPad: 0}),
            frameRate: frameRate
        });

        this.time.delayedCall(1000, () => {
            //this.music.setLoop(true);
            //this.music.play();
            this.cameras.main.fadeIn(1000);
            this.time.delayedCall(1000, () => {
                this.endScene.anims.play('endSceneAnim1', true);
                this.time.delayedCall(5200, () =>{
                    this.endScene.anims.play('endSceneAnim2', true);
                });
                this.time.delayedCall(10400, () => {
                    //this.tweens.add({
                        //targets:  this.music,
                        //volume:   0,
                        //duration: 3000
                    //});
                    this.cameras.main.fadeOut(3000)
                    this.time.delayedCall(3000, () => {
                        this.creditsImage.setAlpha(1);
                        this.cameras.main.fadeIn(1500);
                    });
                });
            });
        });
    }
}