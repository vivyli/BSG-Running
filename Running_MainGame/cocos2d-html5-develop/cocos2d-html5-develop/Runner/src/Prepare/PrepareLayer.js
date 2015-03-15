/**
 * Created by Xinsheng Yang on 2015/3/14.
 */
var PrepareLayer = cc.Layer.extend({

    ctor:function () {
        this._super();
        this.init();
    },
    init:function () {
        var bRet = false;
        if (this._super()) {
            var size = cc.director.getWinSize();
            this.prepareLabel = new cc.LabelTTF("Prepare", "Impact", 38);
            // position the label on the center of the screen
            this.prepareLabel.setPosition(size.width / 2, size.height - 40);
            // add the label as a child to this layer
            this.addChild(this.prepareLabel, 5,202);
            var startItem = new cc.MenuItemImage(
                s_CloseNormal,
                s_CloseSelected,
                function () {
                    cc.log("replace scene to main");
                    var nextScene = new MainScene();
                    cc.director.runScene(new cc.TransitionSlideInR(0.4, nextScene));
                },this);
            var menu = new cc.Menu(startItem);
            menu.setPosition(0, 0);
            this.addChild(menu, 1,102);
            startItem.setPosition(30, 30);
        }

    }

});