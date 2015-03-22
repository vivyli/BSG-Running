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
        this.backgroundLabel = new cc.LabelTTF("Award", "Impact", 38);
        // position the label on the center of the screen
        this.backgroundLabel.setPosition(size.width / 2, size.height - 40);
        // add the label as a child to this layer
        this.addChild(this.backgroundLabel, 5,204);

        var awardBackgroup = new cc.Sprite("ljt.jpg");
        var xScale = size.width / awardBackgroup.width;
        var yScale = size.height / awardBackgroup.height;

        cc.log(xScale.toString());
        cc.log(yScale.toString());
        cc.log(awardBackgroup.getTexture().height.toString());
        cc.log(awardBackgroup.height.toString());

        awardBackgroup.setAnchorPoint(0,0);
        awardBackgroup.setPosition(0,0);


        //TODO: test add runner del
        this.addWinner(1,"num1",s_Photo,"yello");
        this.addWinner(2,"num2",s_Photo,"yello");
        this.addWinner(3,"num3",s_Photo,"yello");
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

    addWinner:function(order,name,photo,color)
    {
        var newWinner = new Winner();
        newWinner.init(order,name,photo,color);
        this.winners[order] = newWinner;
        if(order == 1)
        {
            newWinner.setPosition(cc.p(230,130));
        }
        else if(order == 2)
        {
            newWinner.setPosition(cc.p(420,130));
        }
        else if(order == 3)
        {
            newWinner.setPosition(cc.p(740,130));
        }
        this.addChild(newWinner,5);
    }
});