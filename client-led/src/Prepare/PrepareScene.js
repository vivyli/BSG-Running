/**
 * Created by Xinsheng Yang on 2015/3/14.
 */
var PrepareScene = cc.Scene.extend({
    controlLayer:null,
    preparedPlayers: [],
    onEnter:function () {
        this._super();

        //gGameData.initData();
        var layer = new PrepareLayer();
        layer.init(5,5);
        this.addChild(layer);
        this.controlLayer = layer;
        ControlLayer._getInstance().updateScene(this, EnumSceneName.ePrepare);

        var globalPlayers = ControlLayer._getInstance().players;
        for(var playerId in globalPlayers) {
            var playerObj = globalPlayers[playerId];
            if(!this.preparedPlayers[playerId])
                this.registerPlayer(playerId, playerObj);
        }
        //var spriteFrameCache = cc.SpriteFrameCache.getInstance();
        //spriteFrameCache.addSpriteFrames("res/baseResource.plist","res/baseResource.png");

        //var layer = new WelcomeLayer;
        //layer.init();
        //this.addChild(layer);

//        gSharedEngine.setMusicVolume(1);
//        gSharedEngine.setEffectsVolume(1);
//        gSharedEngine.playMusic(MUSIC_BACKGROUND,true);
    },
    registerPlayer: function(playerId, playerObj)
    {
        this.preparedPlayers[playerId] = true;
        var photo = playerObj[NETWORK_CONSTANTS.USER_PHOTO];
        var name = playerObj[NETWORK_CONSTANTS.USER_NAME];
        this.controlLayer.addWaiter(playerId, photo, name);
    },
    unRegisterPlayer: function(playerId, playerObj)
    {
        delete this.preparedPlayers[playerId];
        this.controlLayer.delWaiter(playerId);
    }
});
