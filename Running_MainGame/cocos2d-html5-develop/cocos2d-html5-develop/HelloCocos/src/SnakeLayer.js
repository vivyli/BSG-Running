/**
 * Created by Xinsheng Yang on 2015/3/8.
 */
var SnakeLayer = cc.Layer.extend({
    snake:null,
    init:function() {
        snake = new Snake();
        snake.init(3,3,10);
        this.addChild(snake);
        this.schedule(this.run,1,cc.REPEAT_FOREVER, 0);
    },

    run:function()
    {
        snake.move();
    }
});