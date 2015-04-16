/**
 * Created by Xinsheng Yang on 2015/3/15.
 */
var RunnerLayer = cc.Layer.extend({
    runners:null,
    gap:60,
    winnerCount:0,
    receiveData:false,
    ctor:function () {
        this._super();
        this.init();
    },

    init:function () {
        this.runners = new Array();
        var size = cc.director.getWinSize();
        var controlLevel = ControlLayer._getInstance();
        var players = controlLevel.players;
        var runnersCount = 0;
        for(var playerId in players)
        {
            runnersCount++;
        }

        //test code:
        // TODO remove test code
        //test code:
        // TODO remove test code
        //runnersCount = 4;

        this.gap = (size.height - 120) / runnersCount;

        /*
        var logoData = "data:image/jpg;base64,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";
        this.addRunner("hello","bird","yxsh",logoData,1);
        this.addRunner("hello1","dog","yxsh1",logoData,2);
        this.addRunner("hello2","pinkfish","yxsh2",logoData,1);
        this.addRunner("hello3","griffin","yxsh3",logoData,2);

        /*this.runners["hello"].setFinish();
        this.runners["hello1"].setFinish();
        this.runners["hello2"].setFinish();
        this.runners["hello3"].setFinish();*/
        //end


        for(var playerId in players)
        {
            var playerObj = players[playerId];
            var role = playerObj[NETWORK_CONSTANTS.USER_ROLE];
            cc.log("runner role", role);
            var name = playerObj[NETWORK_CONSTANTS.USER_NAME];
            var photo = playerObj[NETWORK_CONSTANTS.USER_PHOTO];
            var gender = playerObj[NETWORK_CONSTANTS.USER_GENDER];
            this.addRunner(playerId, role, name, photo, gender);
        }

        this.schedule(this.update,0,null,3);
        this.scheduleOnce(this.enableSetSpeed,5.5);
    },

    enableSetSpeed:function()
    {
        for(var id in this.runners){
            this.runners[id].speed = 0;
        }
        this.receiveData = true;

    },


    addRunner:function(id,role,name,photo,gender){
        var nextRunner = new Runner();
        nextRunner.init(id,photo,name,gender,role);
        cc.log("runner init role", role)
        var idx = 0;
        for (var runner in this.runners) {
            idx++;
        }
        var xOffset = 50;
        nextRunner.setPosition(cc.p(xOffset,idx*this.gap+60));
        this.runners[id] = nextRunner;
        this.addChild(nextRunner,10000-idx);
    },

    update: function (dt) {
        var size = cc.director.getWinSize();
        for (var id in this.runners) {
            var runner = this.runners[id];

            if(runner.getPosition().x >= size.width-30)
            {
                if(!runner.isFinish) {
                    //TODO: finish running
                    cc.log(id+" finish run! ");
                    runner.setFinish();

                    var countLimit = GameDefinition.WinnerCountLimit;
                    ControlLayer._getInstance().addWinner(this.winnerCount, id);
                    this.winnerCount = this.winnerCount + 1;
                    var getMapCount = function(map){
                        var count = 0;
                        for(var k in map){
                            count = count + 1;
                        }
                        return count;
                    }
                    var runnersCount = getMapCount(this.runners);
                    if(this.winnerCount>=countLimit || this.winnerCount>=runnersCount) {
                        // end game
                        ControlLayer._getInstance().EndGame();
                    }
                }
            } else {
                runner.update();
            }
        }
    },

    updateRunnerSpeed: function(runnerId, speed){
        if( this.receiveData == false)
            return;
        var runner = this.runners[runnerId];
        if(runner)
        {
            runner.setSpeed(speed);
        }
    }

});