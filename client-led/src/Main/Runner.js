/**
 * Created by Xinsheng Yang on 2015/3/15.
 */
var Runner = cc.Node.extend({
    sprite:null,
    speed:0,
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
        this.nameLabel = new cc.LabelTTF(name, "Impact", 20);
        this.nameLabel.setPosition(cc.p(100, 100));
        this.addChild(this.nameLabel);
        var action = cc.animate(animation);
        var speedAnimation = new cc.Speed(cc.repeatForever(action),1);
        speedAnimation.tag = 10;
        this.sprite.runAction(speedAnimation);


        //this.sprite.stopAction();
    },
    update: function()
    {
        var runner = this;
        runner.setPosition(cc.pAdd(runner.getPosition(),cc.p(runner.speed,0)));

        var speed = this.speed;
        var speedAnimation = this.sprite.getActionByTag(10);
        speedAnimation.setSpeed(3);
        if(speed >= 1) {
            this.startFire();
        } else {
            this.stopFire();
        }
    },
    setFinish: function()
    {
        this.isFinish = true;
        this.stopFire();
        this.sprite.stopAllActions();
    },
    setSpeed: function(speed)
    {
        this.speed = speed;
        this.sprite
        if(speed >= 2) {
            this.startFire();
        } else {
            this.stopFire();
        }
    },
    startFire: function()
    {
        if(this._emitter && this._emitter.isActive()) return 0;
        //this._emitter = new cc.ParticleSun();
        this._emitter = new cc.ParticleGalaxy();
        //this._emitter = new cc.ParticleSystem("comet.plist");
        this._emitter.setPosition(cc.p(-30,-10));
        this.addChild(this._emitter);
        this._emitter.texture = cc.textureCache.addImage(s_Fire);
        if (this._emitter.setShapeType)
            this._emitter.setShapeType(cc.ParticleSystem.BALL_SHAPE);
    },
    stopFire: function()
    {
        if(this._emitter && this._emitter.isActive && this._emitter.isActive()) {
            this._emitter.stopSystem();
        }
    }
});