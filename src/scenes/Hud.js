class Hud extends Phaser.Scene {
    constructor() {
        super("hudScene");
    }
    
    HUD ()
    {
        Phaser.Scene.call(this, { key: 'Hud' });
    }
    
    preload() {
        this.load.image('ui', './assets/Splash/ui.png');
        this.load.image('pause', './assets/Splash/pause.png');
    }

    create () {
        this.add.image(0,0, 'ui').setOrigin(0,0).setDepth(1);;
    }
}