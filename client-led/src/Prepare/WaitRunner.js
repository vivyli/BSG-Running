/**
 * Created by Xinsheng Yang on 2015/3/17.
 */



var WaitRunner = cc.Node.extend({
    name:"",
    photo:null,
    id:null,
    runnerRole:"",
    xIdx:0,
    yIdx:0,
    init:function (id, photo,name) {
        var cache = cc.spriteFrameCache;
        var randomFrameNum = Math.floor(Math.random() * 4 + 1);

        cache.addSpriteFrames(s_RunnerPlist,s_RunnerPng);
        var waitFrameStr = "waitFrame_"+randomFrameNum.toString()+".png";
        this.sprite = new cc.Sprite(cache.getSpriteFrame(waitFrameStr));
        this.sprite.setScale(0.5);
        this.addChild(this.sprite);

        // set for debug
        //TODO: del
        //photo = new cc.Sprite(s_Photo);
        photo = ControlLayer._getInstance().getImgSpriteWithData(photo);
        this.photo = photo;
        this.photo.setPosition(cc.p(3,3));
        //this.photo.setScale(0.5,0.5)
        this.addChild(this.photo);


        this.name = name;
        this.nameLabel = new cc.LabelTTF(name, "Impact", 50);
        this.nameLabel.setPosition(cc.p(5,75));
        this.nameLabel.setColor(cc.color(255,0,0));
        this.addChild(this.nameLabel);

        //this.sprite.stopAction();


    }

});