PLAYER_ID = Date.now();
CLIENT_GAME_ID = 1;
CLIENT_GAME_STATE = 0;

// config
GC_h = 960
GC_w = 480;

cc.game.onStart = function(){
    cc.view.adjustViewPort(true);
    cc.view.setDesignResolutionSize(GC_w, GC_h, cc.ResolutionPolicy.EXACT_FIT);
    cc.view.resizeWithBrowserSize(true);

    //load resources
    cc.LoaderScene.preload(g_resources, function () {
        cc.director.runScene(new GameControllerScene());
    }, this);
};
cc.game.run();