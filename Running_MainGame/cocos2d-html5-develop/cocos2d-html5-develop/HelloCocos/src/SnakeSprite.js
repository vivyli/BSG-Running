/**
 * Created by Xinsheng Yang on 2015/3/8.
 */

var SnakeNode = cc.Class.extend({
    x:0,
    y:0,
    sprite:null,
    direct:0,// 0 left 1 up 3 right 4 down
    init:function(x,y,sp){
        this.x = x;
        this.y = y;
        this.sprite = sp;
    }
});

var Snake = cc.Node.extend({
    snakeNodeArr:[],
    gridLen:0,
    status:0,
    speed:3,
    init:function (x, y, len) {
        this.gridLen = len;

        var firstSnakeSprite = new cc.Sprite(s_CloseNormal)
        firstSnakeSprite.setPosition(cc.p(x*len,y*len));

        var firstSnakeNode = new SnakeNode();
        firstSnakeNode.init(x,y,firstSnakeSprite);
        this.addChild(firstSnakeSprite);
        this.snakeNodeArr.push(firstSnakeNode);
    },

    addNode:function(){

    },

    removeNode:function(idx){

    },

    move:function()
    {

        if(status == 0) {
            var arrLen = this.snakeNodeArr.length;
            if(this.snakeNodeArr[0].direct == 0)
            {
                var toX = (this.snakeNodeArr[0].x *this.gridLen)  + this.gridLen *this.speed ;
                var toY = this.snakeNodeArr[0].y * this.gridLen;
                var moveAction = new cc.MoveTo(1,cc.p(toX,toY));
                this.snakeNodeArr[0].sprite.runAction(moveAction);
                this.snakeNodeArr[0].x += this.speed;
            }
            for (var i = 1;i < arrLen; i++)
            {

            }
        }
    }
});

