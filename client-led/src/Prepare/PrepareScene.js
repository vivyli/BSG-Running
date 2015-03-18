/**
 * Created by Xinsheng Yang on 2015/3/14.
 */
var PrepareScene = cc.Scene.extend({
    onEnter:function () {
        this._super();

        //gGameData.initData();
        var layer = new PrepareLayer();
        layer.init(5,5);
        this.addChild(layer);

        ControlLayer._getInstance().updateScene(this, EnumSceneName.ePrepare);
        //var spriteFrameCache = cc.SpriteFrameCache.getInstance();
        //spriteFrameCache.addSpriteFrames("res/baseResource.plist","res/baseResource.png");

        //var layer = new WelcomeLayer;
        //layer.init();
        //this.addChild(layer);

//        gSharedEngine.setMusicVolume(1);
//        gSharedEngine.setEffectsVolume(1);
//        gSharedEngine.playMusic(MUSIC_BACKGROUND,true);
    }
});
