/**
 * Created by Xinsheng Yang on 2015/3/14.
 */
var AwardScene = cc.Scene.extend({
    onEnter:function () {
        this._super();

        //gGameData.initData();
        var layer = new AwardLayer;
        //layer.init();
        this.addChild(layer);
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