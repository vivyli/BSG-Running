/**
 * Created by Xinsheng Yang on 2015/3/14.
 */
var MainScene = cc.Scene.extend({
    runnerLayer:null,
    onEnter:function () {
        this._super();

        var backgroundLayer = new BackgroundLayer();
        this.addChild(backgroundLayer,5,203);

        var mainControlLayer = new MainControlLayer();
        this.addChild(mainControlLayer,10,204);

        this.runnerLayer = new RunnerLayer();
        this.addChild(this.runnerLayer,15,205);

        var preEffectsLayer = new PreEffectsLayer();
        this.addChild(preEffectsLayer,20,206);

        ControlLayer._getInstance().updateScene(this, EnumSceneName.eMain);
    },
    updateRunnerSpeed: function(runnerId, speed)
    {
        if(this.runnerLayer) {
            this.runnerLayer.updateRunnerSpeed(runnerId, speed);
        }
    }
});
