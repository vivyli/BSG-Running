QRCODE_DATA = -1;

cc.game.onStart = function(){
    //var designSize = cc.size(480, 800);
    var screenSize = cc.view.getFrameSize();
    var designSize = screenSize;
    if(!cc.sys.isNative && screenSize.height < 800){
        designSize = cc.size(1024, 768);
        //designSize = screenSize;
        cc.loader.resPath = "res/Normal";
    }else{
        designSize = cc.size(1024, 768);


        cc.loader.resPath = "res/HD";
    }
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