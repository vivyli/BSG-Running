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
        var xOffset = [30, 580]; // rank, sprite
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

        // photo name gender
        ControlLayer._getInstance().setPlayerPhotoName(this, name, s_PhotoBox, gender, c, 2);

        // sprite
        var cache = cc.spriteFrameCache;
        cache.addSpriteFrames(s_RunnerPlist,s_RunnerPng);
        this.sprite = new cc.Sprite(cache.getSpriteFrame("qk_7_001.png"));
        this.sprite.setPosition(cc.p(xOffset[1],0));
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
    }
});