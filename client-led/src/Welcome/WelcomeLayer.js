/**
 * Created by Xinsheng Yang on 2015/3/14.
 */
var WelcomeLayer = cc.Layer.extend({
    logo:null,
    runners:null,
    counter:1,
    qrCode:null,
    qrLabel:null,
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

            //this.weilcomeLabel = new cc.LabelTTF("开心摇摇乐", "黑体", 50);
            //this.weilcomeLabel.setPosition(size.width / 2, size.height - 40);
            //this.addChild(this.weilcomeLabel, 15,201);

            this.logo = new cc.Sprite(s_Logo);
            this.logo.setPosition(cc.p(size.width / 2 + 30, size.height - 90));
            this.addChild(this.logo, 15000, 2001);

            var self = this;
            var beginItem = new cc.MenuItemImage(
                s_ButtonYaoUp,
                s_ButtonYaoDown,
                function () {
                    // loading gif
                    var loading = new cc.Sprite(s_Loading);
                    loading.setPosition(cc.p(size.width/2, size.height/2));
                    self.addChild(loading, 100000, 200);

                    ControlLayer._getInstance().Login();
                },this);
            var menu = new cc.Menu(beginItem);
            menu.setPosition(0, 0);
            this.addChild(menu, 100000, 101);
            beginItem.setPosition(size.width/2, size.height/2-300);

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
    showWXqrcode:function(data)
    {
        var notify = new cc.LabelTTF("扫描关注公众号", "Impact", 30);
        notify.fillStyle = cc.color("#3d4d75");
        notify.setPosition(cc.p(858,70));
        this.addChild(notify, 20001);

        cc.textureCache.addImage(data, this.texLoaded, this);
    },

    texLoaded: function (texture) {
        if (texture instanceof cc.Texture2D) {
            var qrCode = new cc.Sprite(texture);
            qrCode.setAnchorPoint(cc.p(0,0));
            qrCode.setPosition(cc.p(750,100));
            qrCode.setScale(0.5, 0.5);
            this.addChild(qrCode, 10000);
        }
    },

    update:function(dt)
    {
        var size = cc.director.getWinSize();
        var randomNum100 = Math.floor(Math.random() * 100 + 1);
        if(randomNum100 > 93)
        {
            //cc.log("add runner");
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
