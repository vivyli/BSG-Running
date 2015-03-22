/**
 * Created by Xinsheng Yang on 2015/3/15.
 */
var BackgroundLayer = cc.Layer.extend({

    ctor:function () {
        this._super();
        this.init();
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
            var background = new cc.Sprite(s_MainBackground);
            background.setAnchorPoint(cc.p(0,0));
            background.setPosition(cc.p(0,0));
            this.addChild(background,5);



            var backgrond_water = new cc.Sprite(s_MainBackground_water);
            backgrond_water.setScale(2);
            backgrond_water.setAnchorPoint(cc.p(0,0));
            backgrond_water.setPosition(cc.p(0,size.height-308));
            this.addChild(backgrond_water,4);

        }

    }

});