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
    }

});