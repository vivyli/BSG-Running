/**
 * Created by Xinsheng Yang on 2015/3/14.
 */


ControlLayer = cc.Class.extend({
    scene:null,
    sceneName:"",
    init:function()
    {

    },
    updateScene:function(scene,sceneName)
    {
        this.scene = scene;
        this.sceneName = sceneName;
    }

});

ControlLayer.sharedDirector = null;
ControlLayer.firstUseDirector = true;

ControlLayer._getInstance = function () {
    if (ControlLayer.firstUseDirector) {
        ControlLayer.firstUseDirector = false;
        ControlLayer.sharedDirector = new cc.ControlLayer();
        ControlLayer.sharedDirector.init();
    }
    return cc.ControlLayer.sharedDirector;
};