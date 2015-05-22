/**
 * Created by Xinsheng Yang on 2015/3/15.
 */
var Runner = cc.Node.extend({
    sprite:null,
    speed:1,
    name:"",
    photo:null,
    gender:1,
    id:null,
    isFinish:null,
    _emitter:null,
    runnerRole:null,

    init:function (id, photo,name,gender,runnerRole) {
        cc.log("init of runner", runnerRole);
        var cache = cc.spriteFrameCache;
        cache.addSpriteFrames("runner_"+runnerRole+".plist","runner_"+runnerRole+".png");
        this.sprite = new cc.Sprite(cache.getSpriteFrame(runnerRole+"_1.png"));
        this.addChild(this.sprite);
        this.name = name;
        this.runnerRole = runnerRole;
        this.isFinish = false;
        cache.addSpriteFrames(s_RunnerPlist,s_RunnerPng);

        var c = cc.color(cc.color(139, 90, 0, 200));
        if(gender<=1){
            c = cc.color(cc.color(39, 64, 139, 200));
        }

        // photo name gender
        ControlLayer._getInstance().setPlayerPhotoName(this, name, photo, gender, c, 1);

        // animation
        var animationCache = cc.animationCache;
        var animation = animationCache.getAnimation(runnerRole);
        if (animation == null) {
            animation = new cc.Animation;
            animation.addSpriteFrame(cache.getSpriteFrame(runnerRole+"_1.png"));
            animation.addSpriteFrame(cache.getSpriteFrame(runnerRole+"_2.png"));
            animation.addSpriteFrame(cache.getSpriteFrame(runnerRole+"_3.png"));
            animation.addSpriteFrame(cache.getSpriteFrame(runnerRole+"_4.png"));
            animation.addSpriteFrame(cache.getSpriteFrame(runnerRole+"_5.png"));

            animation.setDelayPerUnit(0.1);
            animation.setRestoreOriginalFrame(false);
            animationCache.addAnimation(animation, runnerRole);
        }
        var action = cc.animate(animation);
        var speedAnimation = new cc.Speed(cc.repeatForever(action),1);
        speedAnimation.tag = 10;
        this.sprite.runAction(speedAnimation);


        //this.sprite.stopAction();
    },
    update: function()
    {
        if(this.isFinish == false) {
            var runner = this;
            runner.setPosition(cc.pAdd(runner.getPosition(), cc.p(runner.speed*GameDefinition.SpeedRate, 0)));

            var speed = this.speed;
            var speedAnimation = this.sprite.getActionByTag(10);

            speedAnimation.setSpeed(this._convertAnimationSpeed(speed));
        }
    },
    _convertAnimationSpeed: function(speed)
    {
        var min = 0.2;
        var max = 8;
        var aSpeed = speed/3;
        aSpeed = Math.max(min, aSpeed);
        aSpeed = Math.min(max, aSpeed);
        return 1.5*aSpeed;
    },
    setFinish: function()
    {
        this.isFinish = true;
        this.stopFire();
        this.sprite.stopAllActions();
        var cache = cc.spriteFrameCache;
        cache.addSpriteFrames("front.plist","front.png");
        this.sprite.setSpriteFrame(cache.getSpriteFrame("front_"+this.runnerRole+".png"));

        /*
        var finishAcc = new cc.JumpBy(0.7,cc.p(0,0),1,10,1);
        var sequenceAnimation =new cc.Sequence(finishAcc);
        this.runAction(cc.repeatForever(sequenceAnimation,0));
        */
    },
    setSpeed: function(speed)
    {
        if(this.isFinish == true)
            return;
        speed = speed > 0.5 ? speed : 0.5;
        this.speed = speed;
        var speedAnimation = this.sprite.getActionByTag(10);
        if(speedAnimation){
            speedAnimation.setSpeed(this._convertAnimationSpeed(speed));
        }
        if(speed >= GameDefinition.SpeedEffectLimit) {
            this.stopFire();
            this.startFire();
        } else {
            this.stopFire();
        }
    },
    startFire: function()
    {
        if(this._emitter && this._emitter.isActive()) return 0;
        if(this.speed > GameDefinition.SpeedEffectLimit2)
        {
            this._emitter = new cc.ParticleSun();
        }
        else
        {
            this._emitter = new cc.ParticleGalaxy();
        }
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