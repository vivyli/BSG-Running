/**
 * Created by Xinsheng Yang on 2015/3/15.
 */
var RunnerLayer = cc.Layer.extend({
    runners:null,
    gap:50,
    ctor:function () {
        this._super();
        this.init();
    },

    init:function () {
        this.runners = new Array();



        //test code:
        //this.addRunner("hello","yello","yxsh",s_Photo);

        var controlLevel = ControlLayer._getInstance();
        var players = controlLevel.players;
        for(var playerId in players)
        {
            this.addRunner(playerId.toString(),"yello",playerId.toString(),s_Photo);
        }

        this.schedule(this.update,0);
    },

    addRunner:function(id,color,name,photo){
        var nextRunner = new Runner();
        nextRunner.init(id,photo,name);
        var idx = this.runners.length+1;
        nextRunner.setPosition(cc.p(50,idx*this.gap+20));
        this.runners[id] = nextRunner;
        this.addChild(nextRunner);
    },

    update: function (dt) {
        for (var id in this.runners) {
            var runner = this.runners[id];

            if(runner.getPosition().x >= 800)
            {
                if(!runner.isFinish) {
                    //TODO: finish running
                    cc.log(id+" finish run! ");
                    runner.setFinish();
                }
            } else {
                runner.setPosition(cc.pAdd(runner.getPosition(),cc.p(runner.speed,0)));
            }
        }
    },

    updateRunnerSpeed: function(runnerId, speed){
        var runner = this.runners[runnerId];
        if(runner)
        {
            runner.speed = speed;
        }
    }

});