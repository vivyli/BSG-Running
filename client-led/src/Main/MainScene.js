/**
 * Created by Xinsheng Yang on 2015/3/14.
 */
var MainScene = cc.Scene.extend({
    onEnter:function () {
        this._super();

        var backgroundLayer = new BackgroundLayer();
        this.addChild(backgroundLayer,5,203);

        var mainControlLayer = new MainControlLayer();
        this.addChild(mainControlLayer,1,204);

        var runnerLayer = new RunnerLayer();
        this.addChild(runnerLayer,3,205);

        var preEffectsLayer = new PreEffectsLayer();
        this.addChild(preEffectsLayer,3,206);
    }

});