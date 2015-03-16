/**
 * Created by Xinsheng Yang on 2015/3/14.
 */
var WelcomeLayer = cc.Layer.extend({

    ctor:function () {
        this._super();
        this.init();
    },
    init:function () {
        var bRet = false;
        if (this._super()) {
            var size = cc.director.getWinSize();

            this.weilcomeLabel = new cc.LabelTTF("Welcome", "Impact", 38);
            // position the label on the center of the screen
            this.weilcomeLabel.setPosition(size.width / 2, size.height - 40);
            // add the label as a child to this layer
            this.addChild(this.weilcomeLabel, 5,201);

            var beginItem = new cc.MenuItemImage(
                s_CloseNormal,
                s_CloseSelected,
                function () {
                        cc.log("begin game");

                        var nextScene = new PrepareScene();

                        cc.director.runScene(new cc.TransitionSlideInR(0.4, nextScene));
                },this);
            var menu = new cc.Menu(beginItem);
            menu.setPosition(0, 0);
            this.addChild(menu, 1, 101);
            beginItem.setPosition(size.width - 20, 20);
        }

    }

});
