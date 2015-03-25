/**
 * Created by Xinsheng Yang on 2015/3/15.
 */
var Runner = cc.Node.extend({
    sprite:null,
    speed:0,
    name:"",
    photo:null,
    gender:1,
    id:null,
    isFinish:null,
    _emitter:null,
    runnerRole:null,
    init:function (id, photo,name,gender,runnerRole) {
        var cache = cc.spriteFrameCache;
        cache.addSpriteFrames("runner_"+"bird"+".plist","runner_"+"bird"+".png");
        this.sprite = new cc.Sprite(cache.getSpriteFrame("1.png"));
        this.addChild(this.sprite);
        this.name = name;


        cache.addSpriteFrames(s_RunnerPlist,s_RunnerPng);

        // photo frame
        //var frameStr = "waitFrame_1.png";
        //var photoFrame = new cc.Sprite(cache.getSpriteFrame(frameStr));
        //photoFrame.setScale(0.5);
        //photoFrame.setPosition(cc.p(0,90));
        //this.addChild(photoFrame);

        var c = cc.color(cc.color(139, 90, 0, 200));
        if(gender<=1){
            c = cc.color(cc.color(39, 64, 139, 200));
        }

        // photo name gender
        ControlLayer._getInstance().setPlayerPhotoName(this, name, s_PhotoBox, gender, c, 1);

        /*
        // photo
        var photoBox = new cc.Sprite(s_PhotoBox);
        photoBox.setPosition(cc.p(0,80));
        this.addChild(photoBox);
        this.photo = ControlLayer._getInstance().getMaskSprite(s_Photo);
        this.photo.setPosition(cc.p(0,80));
        this.addChild(this.photo);

        // gender label
        var genderIcon = new cc.Sprite("award_head_gender2"+gender+".png");
        genderIcon.setPosition(cc.p(66, 80));
        this.addChild(genderIcon);

        // name label
        this.nameLabel = new cc.LabelTTF(name, "Impact", 20);
        this.nameLabel.setPosition(cc.p(110, 80));
        this.nameLabel.setColor(c);
        this.addChild(this.nameLabel);*/

        // animation
        var animationCache = cc.animationCache;
        var animation = animationCache.getAnimation("runner");
        if (animation == null) {
            animation = new cc.Animation;
            animation.addSpriteFrame(cache.getSpriteFrame("1.png"));
            animation.addSpriteFrame(cache.getSpriteFrame("2.png"));
            animation.addSpriteFrame(cache.getSpriteFrame("3.png"));
            animation.addSpriteFrame(cache.getSpriteFrame("4.png"));
            animation.addSpriteFrame(cache.getSpriteFrame("5.png"));

            animation.setDelayPerUnit(0.1);
            animation.setRestoreOriginalFrame(false);
            animationCache.addAnimation(animation, "runner");
        }
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
        speedAnimation.setSpeed(2);
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
        var speedAnimation = this.sprite.getActionByTag(10);
        if(speedAnimation){
            speedAnimation.setSpeed(3);
        }
        if(speed >= 3) {
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