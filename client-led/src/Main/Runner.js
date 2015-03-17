/**
 * Created by Xinsheng Yang on 2015/3/15.
 */
var Runner = cc.Node.extend({
    sprite:null,
    speed:1,
    name:"",
    photo:null,
    id:null,
    isFinish:null,
    _emitter:null,
    init:function (id, photo,name) {
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
        if(animation == null)
        {
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
            animationCache.addAnimation(animation,"runner");
        }
        this.nameLabel = new cc.LabelTTF(name, "Impact", 20);
        this.nameLabel.setPosition(cc.p(100,100));
        this.addChild(this.nameLabel);
        var action = cc.animate(animation);

        this.sprite.runAction(cc.repeatForever(action));
        //this.sprite.stopAction();

        this.setFire();
    },
    setFinish: function()
    {
        this.isFinish = true;
        this.stopFire();
    },
    setFire: function()
    {
        this._emitter = new cc.ParticleSun();
        this._emitter.setPosition(cc.p(0,0));
        this.addChild(this._emitter);
        this._emitter.texture = cc.textureCache.addImage(s_Fire);
        if (this._emitter.setShapeType)
            this._emitter.setShapeType(cc.ParticleSystem.BALL_SHAPE);
    },
    stopFire: function()
    {
        if(this._emitter.isActive()) {
            this._emitter.stopSystem();
        }
    }
});