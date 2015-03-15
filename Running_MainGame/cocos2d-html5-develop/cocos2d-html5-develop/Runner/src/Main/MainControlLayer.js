/**
 * Created by Xinsheng Yang on 2015/3/15.
 */
var MainControlLayer = cc.Layer.extend({

    ctor:function () {
        this._super();
        this.init();
    },

    finish:function(){

            var nextScene = new MainScene();
            cc.director.runScene(new cc.TransitionSlideInR(0.4, nextScene));

    },
    init:function () {
        var bRet = false;

        if (this._super()) {
            var size = cc.director.getWinSize();
            this.backgroundLabel = new cc.LabelTTF("Game\nBackground", "Impact", 38);
            // position the label on the center of the screen
            this.backgroundLabel.setPosition(size.width / 2, size.height - 40);
            // add the label as a child to this layer
            this.addChild(this.backgroundLabel, 5,203);
            var startItem = new cc.MenuItemImage(
                s_CloseNormal,
                s_CloseSelected,
                this.finish,
                this
            );

            var menu = new cc.Menu(startItem);
            menu.setPosition(0, 0);
            this.addChild(menu, 1,103);
            startItem.setPosition(30, 30);
        }

    }

});