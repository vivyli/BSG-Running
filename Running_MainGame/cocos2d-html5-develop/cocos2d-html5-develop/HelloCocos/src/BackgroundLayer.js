/**
 * Created by Xinsheng Yang on 2015/3/6.
 */
var BackgroundLayer = cc.Layer.extend({
    backGround:null,

    init:function () {

        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask director the window size
        var size = cc.director.getWinSize();

        // add a "close" icon to exit the progress. it's an autorelease object
        this.backGround = new cc.TMXTiledMap(s_MapTile);

        // add "Helloworld" splash screen"
        this.backGround.setAnchorPoint(cc.p(0,0));

        this.addChild(this.backGround,0,500);
    }
});