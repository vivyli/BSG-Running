/**
 * Created by Xinsheng Yang on 2015/3/15.
 */
var AwardLayer = cc.Layer.extend({

    ctor:function () {
        this._super();
        this.init();
    },

    init:function () {
        var size = cc.director.getWinSize();
        this.backgroundLabel = new cc.LabelTTF("Award", "Impact", 38);
        // position the label on the center of the screen
        this.backgroundLabel.setPosition(size.width / 2, size.height - 40);
        // add the label as a child to this layer
        this.addChild(this.backgroundLabel, 5,204);

        var startItem = new cc.MenuItemImage(
            s_CloseNormal,
            s_CloseSelected,
            function () {
                cc.director.runScene(new WelcomeScene());
            },this);
        var menu = new cc.Menu(startItem);
        menu.setPosition(0, 0);
        this.addChild(menu, 1,104);
        startItem.setPosition(size.width - 20, 20);
    }

});