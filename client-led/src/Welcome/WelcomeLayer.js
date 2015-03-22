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

            var background = new cc.Sprite(s_MainBackground);
            background.setAnchorPoint(cc.p(0,0));
            background.setPosition(cc.p(0,0));
            this.addChild(background,5);



            var backgrond_water = new cc.Sprite(s_MainBackground_water);
            backgrond_water.setScale(2);
            backgrond_water.setAnchorPoint(cc.p(0,0));
            backgrond_water.setPosition(cc.p(0,size.height-308));
            this.addChild(backgrond_water,4);

            this.weilcomeLabel = new cc.LabelTTF("Welcome", "Impact", 38);
            // position the label on the center of the screen
            this.weilcomeLabel.setPosition(size.width / 2, size.height - 40);
            //this.setColor(cc.c(253,253,253));
            // add the label as a child to this layer
            this.addChild(this.weilcomeLabel, 15,201);

            var beginItem = new cc.MenuItemImage(
                s_CloseNormal,
                s_CloseSelected,
                function () {
                    // test
                    var fakeId = "123"
                    this.gameId = fakeId;
                    cc.log("### fake gameId, go to prepare scene");
                    var nextScene = new PrepareScene();
                    cc.director.runScene(new cc.TransitionSlideInR(0.4, nextScene));
                },this);
            var menu = new cc.Menu(beginItem);
            menu.setPosition(0, 0);
            this.addChild(menu, 10, 101);
            beginItem.setPosition(size.width - 20, 20);
        }

    }

});
