/**
 * Created by Xinsheng Yang on 2015/3/15.
 */
var PreEffectsLayer = cc.Layer.extend({

    ctor:function () {
        this._super();
    },

    init:function () {

    },

    startCountDown:function(startFinishCallBack){
        var size = cc.director.getWinSize();
        var cache = cc.spriteFrameCache;
        cache.addSpriteFrames(s_StartCountDownPlist,s_StartCountDownPng);
        var startSprite = new cc.Sprite(cache.getSpriteFrame("three.png"));

        var animation = new cc.Animation;
        animation.addSpriteFrame(cache.getSpriteFrame("three.png"));
        animation.addSpriteFrame(cache.getSpriteFrame("two.png"));
        animation.addSpriteFrame(cache.getSpriteFrame("one.png"));
        animation.addSpriteFrame(cache.getSpriteFrame("start.png"));
        animation.setDelayPerUnit(1);
        animation.setRestoreOriginalFrame(false);
        var action = cc.animate(animation);
        startSprite.setPosition(cc.p(size.width/2,size.height/2));

        var bigger = new cc.ScaleBy(1,2);
        var rev = new cc.ScaleBy(0,0.5);
        var finishFunction = new cc.CallFunc(startFinishCallBack);
       // startSprite.setVisible(false);
        var invisible = new cc.CallFunc(this.deleteSprite,startSprite,false);
        var sequenceAnimation =new cc.Sequence(bigger,rev ,bigger,rev,bigger,rev,bigger,invisible);

        this.addChild(startSprite,500,333);
        startSprite.runAction(action);
        startSprite.runAction(sequenceAnimation);




    },
    deleteSprite:function(target)
    {
        target.setVisible(false);
    }









});