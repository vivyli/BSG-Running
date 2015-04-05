/**
 * Created by Xinsheng Yang on 2015/3/15.
 */
var RunnerLayer = cc.Layer.extend({
    runners:null,
    gap:60,
    winnerCount:0,
    ctor:function () {
        this._super();
        this.init();
    },

    init:function () {
        this.runners = new Array();
        var size = cc.director.getWinSize();
        var runnersCount = 0;
        for(var playerId in players)
        {
            runnersCount++;
        }

        //test code:
        // TODO remove test code
        //test code:
        // TODO remove test code
         runnersCount = 4;

        this.gap = (size.height - 120) / runnersCount;

        this.addRunner("hello","bird","yxsh",s_CloseNormal,1);
        this.addRunner("hello1","dog","yxsh1",s_CloseNormal,2);
        this.addRunner("hello2","pinkfish","yxsh2",s_CloseNormal,1);
        this.addRunner("hello3","griffin","yxsh3",s_CloseNormal,2);

        this.runners["hello"].setFinish();
        this.runners["hello1"].setFinish();
        this.runners["hello2"].setFinish();
        this.runners["hello3"].setFinish();
        //end

        var controlLevel = ControlLayer._getInstance();
        var players = controlLevel.players;
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

        this.schedule(this.update,0);
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
        this.addChild(nextRunner);
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
        var runner = this.runners[runnerId];
        if(runner)
        {
            runner.setSpeed(speed);
        }
    }

});