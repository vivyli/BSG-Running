cc.game.onStart = function(){
    //var designSize = cc.size(480, 800);
    var screenSize = cc.view.getFrameSize();
    var designSize = screenSize;
    designSize = cc.size(1024, 768);
    cc.log("designSize.width"+designSize.width);
    cc.log("designSize.height"+designSize.height);
    cc.log("screenSize.width"+screenSize.width);
    cc.log("screenSize.height"+screenSize.height);

    cc.view.setDesignResolutionSize(designSize.width, designSize.height, cc.ResolutionPolicy.EXACT_FIT);

    //load resources
    cc.LoaderScene.preload(g_resources, function () {
        cc.director.runScene(new WelcomeScene());
    }, this);
};
cc.game.run();