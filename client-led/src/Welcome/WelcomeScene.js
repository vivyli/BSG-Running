/**
 * Created by Xinsheng Yang on 2015/3/14.
 */
var WelcomeScene = cc.Scene.extend({
    layer: null,
    onEnter:function () {
        this._super();

        //gGameData.initData();

        //var spriteFrameCache = cc.SpriteFrameCache.getInstance();
        //spriteFrameCache.addSpriteFrames("res/baseResource.plist","res/baseResource.png");

        this.layer = new WelcomeLayer;
        //layer.init();
        this.addChild(this.layer);
        this.onWXqrcodeReceived();

        ControlLayer._getInstance().updateScene(this, EnumSceneName.eWelcome);
        ControlLayer._getInstance().ResetGame();
//        gSharedEngine.setMusicVolume(1);
//        gSharedEngine.setEffectsVolume(1);
//        gSharedEngine.playMusic(MUSIC_BACKGROUND,true);
    },
    onWXqrcodeReceived:function () {
        if(QRCODE_DATA != -1) {
            this.layer.showWXqrcode(QRCODE_DATA);
        }
    }
});