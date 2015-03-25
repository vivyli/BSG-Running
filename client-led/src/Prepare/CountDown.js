/**
 * Created by Xinsheng Yang on 2015/3/22.
 */
var CountDown = cc.Node.extend({
    timeCounter:120,
    displayLable:null,
    minute:"",
    sceond:"",
    ctor:function () {
        this._super();
    },
    init:function(countTime)
    {
        if(countTime)
        {
            this.timeCounter = countTime;
        }
        else
        {
            this.timeCounter = 120;
        }
        var size = cc.director.getWinSize();
        var totalSec = Math.floor(this.timeCounter / 1);

        this.minute = Math.floor(totalSec / 60).toString();
        this.sceond = this.formatNumber(Math.floor(totalSec % 60));

        this.displayLable = new cc.LabelTTF(this.minute+":"+this.sceond, "Impact", 40);
        this.displayLable.setColor(cc.color(255,97,0));
        // position the label on the center of the screen
        this.displayLable.setPosition(cc.p(size.width / 2+130, size.height - 40));
        this.addChild(this.displayLable);
        cc.log(this.displayLable.label);
        this.scheduleUpdate();
    },

    formatNumber: function(num) {
       if(num < 10)
            return "0"+num.toString();
        return num.toString();
    },

    update: function (dt) {
        this.timeCounter -= dt;
        if(this.timeCounter <= 0)
        {
            //TODO: time up to next scene
            ControlLayer._getInstance().StartGame();
        }
        //cc.log(this.timeCounter.toString());
        var totalSec = Math.floor(this.timeCounter / 1);

        this.minute = Math.floor(totalSec / 60).toString();
        this.sceond = this.formatNumber(Math.floor(totalSec % 60));
        this.displayLable.setString(this.minute+":"+this.sceond);
    }

});