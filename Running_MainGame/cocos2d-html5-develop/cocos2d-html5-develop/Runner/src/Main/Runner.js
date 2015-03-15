/**
 * Created by Xinsheng Yang on 2015/3/15.
 */
var Runner = cc.Node.extend({
    sprite:null,
    speed:1,
    name:"",
    photo:null,
    id:null,
    init:function (id, photo,name) {
        this.sprite = new cc.Sprite(s_CloseNormal);
        this.addChild(this.sprite);
        name = "test runner";
        photo = new cc.Sprite(s_Photo);
        this.addChild(photo);

    }


});