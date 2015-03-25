/**
 * Created by Xinsheng Yang on 2015/3/21.
 */
var Winner = cc.Node.extend({
    sprite:null,
    order:0,
    name:"",
    gender:1,
    photo:null,
    runnerRole:null,
    init:function(order,name,photo,gender,runnerRole){
        var xOffset = [30, 280, 345, 390, 580]; // rank, photo, gender, name, sprite
        var yOffset = 0;
        var c = cc.color(cc.color(139, 90, 0, 200));
        if(order>=2){
            c = cc.color(cc.color(39, 64, 139, 200));
        }

        // label
        var thisOrder = (order>=2)?2:1;
        var label = new cc.Sprite("award_label"+thisOrder+".png");
        label.setAnchorPoint(cc.p(0.1,0.5));
        this.addChild(label);

        // rank
        var rank = new cc.Sprite("award_rank"+order+".png");
        rank.setPosition(cc.p(xOffset[0],0));
        this.addChild(rank);

        // photo
        var photoBox = new cc.Sprite(s_PhotoBox);
        photoBox.setPosition(cc.p(xOffset[1],0));
        this.addChild(photoBox);
        //photo = new cc.Sprite(s_Photo);
        this.photo = ControlLayer._getInstance().getMaskSprite(s_Photo);
        //photo = this.getMaskSprite(photo);
        this.photo.setPosition(cc.p(xOffset[1],0));
        this.addChild(this.photo);

        // gender label
        var genderIcon = new cc.Sprite("award_head_gender2"+gender+".png");
        genderIcon.setPosition(cc.p(xOffset[2], yOffset));
        this.addChild(genderIcon);

        // name label
        this.nameLabel = new cc.LabelTTF(name, "Impact", 20);
        this.nameLabel.setPosition(cc.p(xOffset[3], 0));
        this.nameLabel.setColor(c);
        this.addChild(this.nameLabel);

        // sprite
        var cache = cc.spriteFrameCache;
        cache.addSpriteFrames(s_RunnerPlist,s_RunnerPng);
        this.sprite = new cc.Sprite(cache.getSpriteFrame("qk_7_001.png"));
        this.sprite.setPosition(cc.p(xOffset[4],0));
        this.addChild(this.sprite);
        this.name = name;
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
        var speedAnimation = new cc.Speed(cc.repeatForever(action),1);
        speedAnimation.tag = 10;
        this.sprite.runAction(speedAnimation);
    },




});