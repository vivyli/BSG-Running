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
        this.schedule(this.update,0);


        //test code:
        this.addRunner("hello","yello","yxsh",s_Photo);

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
            cc.log("move");
            var runner = this.runners[id];

            runner.setPosition(cc.pAdd(runner.getPosition(),cc.p(runner.speed,0)));

            if(runner.x > 500)
            {
                //TODO: finish running
                cc.log("finish run!");
            }
        }
    }

});