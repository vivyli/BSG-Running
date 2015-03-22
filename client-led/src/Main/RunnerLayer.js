/**
 * Created by Xinsheng Yang on 2015/3/15.
 */
var RunnerLayer = cc.Layer.extend({
    runners:null,
    gap:80,
    ctor:function () {
        this._super();
        this.init();
    },

    init:function () {
        this.runners = new Array();
        var size = cc.director.getWinSize();



        //test code:
        // TODO remove test code
        //test code:
        // TODO remove test code
        runnersCount = 4;

        this.gap = size.height / runnersCount;

        this.addRunner("hello","yello","yxsh",s_Photo);
        this.addRunner("hello1","yello","yxsh1",s_Photo);
        this.addRunner("hello2","yello","yxsh2",s_Photo);
        this.addRunner("hello3","yello","yxsh3",s_Photo);

        //end

        var controlLevel = ControlLayer._getInstance();
        var players = controlLevel.players;
        var idx = 0;
        for(var playerId in players)
        {
            this.addRunner(playerId.toString(),"yello",playerId.toString(),s_Photo, idx);
            idx = idx + 1;
        }

        this.schedule(this.update,0);
    },

    addRunner:function(id,color,name,photo,idx){
        var nextRunner = new Runner();
        nextRunner.init(id,photo,name);
        //var idx = this.runners.length+1;
        var idx = 0;
        for (var runner in this.runners) {
            idx++;
        }
        nextRunner.setPosition(cc.p(50,idx*this.gap+20));
        this.runners[id] = nextRunner;
        this.addChild(nextRunner);
    },

    update: function (dt) {
        var size = cc.director.getWinSize();
        for (var id in this.runners) {
            var runner = this.runners[id];

            if(runner.getPosition().x >= size.width-20)
            {
                if(!runner.isFinish) {
                    //TODO: finish running
                    cc.log(id+" finish run! ");
                    runner.setFinish();
                }
            } else {
                runner.update();
            }
        }
    },

    updateRunnerSpeed: function(runnerId, speed){
        var runner = this.runners[runnerId];
        if(runner)
        {
            runner.setSpeed(speed);
        }
    }

});