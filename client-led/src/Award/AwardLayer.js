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
        //this.addWinner(1,"num111111111111111111111111111",s_Photo,1,"yello");
        //this.addWinner(2,"num2",s_Photo,2,"yello");
        //this.addWinner(3,"num3",s_Photo,1,"yello");
        //awardBackgroup.setScale(xScale,yScale);

        var winners = ControlLayer._getInstance().winners;
        var order = 0;
        for(var idx in winners){
            order = order+1;
            var name = winners[idx][NETWORK_CONSTANTS.USER_ID];
            var photo = s_Photo;
            var gender = idx%2+1;
            var color = "yello";
            this.addWinner(order, name, photo, gender, color);
        }

        this.addChild(awardBackgroup);
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
    },

    addWinner:function(order,name,photo,gender,color)
    {
        cc.log("order", order.toString());
        var newWinner = new Winner();
        newWinner.init(order,name,photo,gender,color);
        this.winners[order] = newWinner;
        var baseX = 205;
        var baseY = 500;
        var y = baseY - (order-1)*170;
        newWinner.setPosition(cc.p(baseX,y));
        this.addChild(newWinner,5);
    }
});
