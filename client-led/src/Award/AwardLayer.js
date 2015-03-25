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
        //this.backgroundLabel = new cc.LabelTTF("Award", "Impact", 38);
        // position the label on the center of the screen
        //this.backgroundLabel.setPosition(size.width / 2, size.height - 40);
        // add the label as a child to this layer
        //this.addChild(this.backgroundLabel, 5,204);

        var awardBackgroup = new cc.Sprite(s_awardBackground);
        var xScale = size.width / awardBackgroup.width;
        var yScale = size.height / awardBackgroup.height;

        cc.log(size.width, size.height, awardBackgroup.width, awardBackgroup.height);
        cc.log(awardBackgroup.getContentSize());

        //cc.log(xScale.toString());
        //cc.log(yScale.toString());
        //cc.log(awardBackgroup.getTexture().height.toString());
        //cc.log(awardBackgroup.height.toString());

        awardBackgroup.attr({
            anchorX : 0.5,
            anchorY : 0.5,
            x: size.width/2,
            y: size.height/2
        });


        //TODO: test add runner del
        this.addWinner(1,"num111111111111111111111111111",s_Photo,1,"yello");
        this.addWinner(2,"num2",s_Photo,2,"yello");
        this.addWinner(3,"num3",s_Photo,1,"yello");
        //awardBackgroup.setScale(xScale,yScale);


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