/**
 * Created by Xinsheng Yang on 2015/3/15.
 */
var AwardLayer = cc.Layer.extend({
    winners:null,
    ctor:function () {
        this._super();
        this.init();
    },

    init:function () {
        if(this._super()) {
            var size = cc.director.getWinSize();
            this.winners = new Array();

            var awardBackgroup = new cc.Sprite(s_awardBackground);
            awardBackgroup.attr({
                anchorX : 0.5,
                anchorY : 0.5,
                x: size.width/2,
                y: size.height/2
            });


            //TODO: test add runner del
            //this.addWinner(1,"2222222222222",s_Photo,1,"yello");
            //this.addWinner(2,"num2",s_Photo,2,"yello");
            //this.addWinner(3,"num3",s_Photo,1,"yello");

            var winners = ControlLayer._getInstance().winners;
            var order = 0;
            for(var idx in winners){
                order = order+1;
                var name = winners[idx][NETWORK_CONSTANTS.USER_NAME];
                var photo = winners[idx][NETWORK_CONSTANTS.USER_PHOTO];
                var gender = winners[idx][NETWORK_CONSTANTS.USER_GENDER];
                var role = winners[idx][NETWORK_CONSTANTS.USER_ROLE];
                this.addWinner(order, name, photo, gender, role);
            }

            this.addChild(awardBackgroup);
            var startItem = new cc.MenuItemImage(
                s_ButtonNextUp,
                s_ButtonNextDown,
                function () {
                    cc.director.runScene(new WelcomeScene());
                },this);
            var menu = new cc.Menu(startItem);
            menu.setPosition(0, 0);
            this.addChild(menu, 1,104);
            startItem.setPosition(size.width - 30, size.height - 30);

            cc.log("333");
            var logoData = "data:image/jpg;base64,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";
            var logoTexture = new Image();
            logoTexture.src = logoData;
            logoTexture.width = 96;
            logoTexture.height = 96;
            var _logo = new cc.Sprite(logoTexture);
            _logo.setPosition(cc.p(size.width/2, size.height/2));
            //this.addChild(_logo, 500);
        }
    },
    addWinner:function(order,name,photo,gender,role)
    {
        var newWinner = new Winner();
        newWinner.init(order,name,photo,gender,role);
        this.winners[order] = newWinner;
        var baseX = 205;
        var baseY = 500;
        var y = baseY - (order-1)*170;
        newWinner.setPosition(cc.p(baseX,y));
        this.addChild(newWinner,5);
    }
});
