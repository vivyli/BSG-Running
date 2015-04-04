/**
 * Created by Xinsheng Yang on 2015/3/15.
 */
var MainControlLayer = cc.Layer.extend({

    ctor:function () {
        this._super();
        this.init();
    },

    finish:function(){
        cc.log("### finish of mainControlLayer");
        ControlLayer._getInstance().EndGame();
    },
    init:function () {
        var bRet = false;

        if (this._super()) {
            var size = cc.director.getWinSize();

            var startItem = new cc.MenuItemImage(
                s_ButtonNextUp,
                s_ButtonNextDown,
                this.finish,
                this
            );

            var menu = new cc.Menu(startItem);
            menu.setPosition(0, 0);
            this.addChild(menu, 1,103);
            startItem.setPosition(size.width - 30, size.height - 30);
        }

    }

});