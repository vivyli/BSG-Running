/**
 * Created by Xinsheng Yang on 2015/3/14.
 */
var WelcomeLayer = cc.Layer.extend({
    runners:null,
    counter:1,
    ctor:function () {
        this._super();
        this.init();
    },
    init:function () {
        var bRet = false;
        if (this._super()) {
            var size = cc.director.getWinSize();

            this.runners = new Array();

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
                    var fakeId = "1"
                    this.gameId = fakeId;
                    //cc.log("### fake gameId, go to prepare scene");
                    //var nextScene = new PrepareScene();
                    //cc.director.runScene(new cc.TransitionSlideInR(0.4, nextScene));

                    cc.log("### led emit login");
                    ControlLayer._getInstance().Login();
                },this);
            var menu = new cc.Menu(beginItem);
            menu.setPosition(0, 0);
            this.addChild(menu, 100000, 101);
            beginItem.setPosition(size.width - 20, 20);

            this.scheduleUpdate();
        }
    },
    addRunner:function(){
        var nextRunner = new WelcomeRunner();
        var randomSpeed =  Math.floor(Math.random() * 5 + 1);
        var randomRole = ControlLayer._getInstance().getRandomRole();
        nextRunner.init(this.counter,this.counter,randomRole,randomSpeed);
        //var idx = this.runners.length+1;
        var idx = 0;
        for (var runner in this.runners) {
            idx++;
        }
        var xOffset = 50;
        var randomY = Math.floor(Math.random() * 500 + 50);
        nextRunner.setPosition(cc.p(xOffset,randomY));
        this.runners[this.counter] = true;
        this.addChild(nextRunner,1000-randomY,this.counter);
        this.counter++;
    },
    update:function(dt)
    {
        var size = cc.director.getWinSize();
        var randomNum100 = Math.floor(Math.random() * 100 + 1);
        if(randomNum100 > 93)
        {
            cc.log("add runner");
            this.addRunner();
        }
        for (var id in this.runners) {
            if(this.runners[id] == true) {
                var runner = this.getChildByTag(id);

                if (runner.getPosition().x >= size.width) {
                    if (!runner.isFinish) {
                        //TODO: finish running
                        this.removeChildByTag(runner.tag);
                        this.runners[id] = false;
                    }
                } else {
                    runner.update();
                }
            }
        }
    }

});
