/**
 * Created by Xinsheng Yang on 2015/3/21.
 */
var Winner = cc.Node.extend({
    sprite:null,
    order:0,
    name:"",
    photo:null,
    runnerRole:null,
    init:function(order,name,photo,runnerRole){
        var cache = cc.spriteFrameCache;
        cache.addSpriteFrames(s_RunnerPlist,s_RunnerPng);
        this.sprite = new cc.Sprite(cache.getSpriteFrame("qk_7_001.png"));
        this.addChild(this.sprite);
        this.name = name;

        photo = new cc.Sprite(s_Photo);
        photo.setPosition(cc.p(0,90));
        this.addChild(photo);


        var animationCache = cc.animationCache;


        var animation = animationCache.getAnimation("runner");
        if (animation == null) {
            animation = new cc.Animation;
            animation.addSpriteFrame(cache.getSpriteFrame("qk_7_001.png"));
            animation.addSpriteFrame(cache.getSpriteFrame("qk_7_002.png"));
            animation.addSpriteFrame(cache.getSpriteFrame("qk_7_003.png"));
            animation.addSpriteFrame(cache.getSpriteFrame("qk_7_004.png"));
            animation.addSpriteFrame(cache.getSpriteFrame("qk_7_005.png"));
            animation.addSpriteFrame(cache.getSpriteFrame("qk_7_006.png"));
            animation.addSpriteFrame(cache.getSpriteFrame("qk_7_007.png"));
            animation.addSpriteFrame(cache.getSpriteFrame("qk_7_008.png"));
            animation.setDelayPerUnit(0.1);
            animation.setRestoreOriginalFrame(false);
            animationCache.addAnimation(animation, "runner");
        }

        var action = cc.animate(animation);

        this.nameLabel = new cc.LabelTTF(name, "Impact", 20);
        this.nameLabel.setPosition(cc.p(100, 100));

        this.addChild(this.nameLabel);
        var action = cc.animate(animation);
        var speedAnimation = new cc.Speed(cc.repeatForever(action),1);
        speedAnimation.tag = 10;
        this.sprite.runAction(speedAnimation);
    }



});