/**
 * Created by Xinsheng Yang on 2015/3/14.
 */

//TODO: test del

var g_counter = 0;

var PrepareLayer = cc.Layer.extend({
    waiterArr:null,
    hasWaiter:null,
    widthIdx:5,
    heightIdx: 5,
    xGap:1,
    yGap:1,
    ctor:function () {
        this._super();
    },
    init:function (width,height) {

        var bRet = false;
        this.widthIdx = width;
        this.heightIdx = height;
        if (this._super()) {
            var size = cc.director.getWinSize();

            var background = new cc.Sprite(s_prepareBackground);
            background.setPosition(cc.p(size.width/2,size.height/2));
            this.addChild(background);
            this.prepareLabel = new cc.LabelTTF("Prepare", "Impact", 38);
            // position the label on the center of the screen
            this.prepareLabel.setPosition(size.width / 2, size.height - 40);
            // add the label as a child to this layer
            this.addChild(this.prepareLabel, 5,202);
            var startItem = new cc.MenuItemImage(
                s_CloseNormal,
                s_CloseSelected,
                function () {
                    ControlLayer._getInstance().StartGame();
                },this);
            var menu = new cc.Menu(startItem);
            menu.setPosition(0, 0);
            this.addChild(menu, 1,102);
            startItem.setPosition(size.width - 20, 20);

            this.waiterArr = new Array();
            this.hasWaiter = new Array();
            for(i = 0; i < this.height;i++)
            {
                this.hasWaiter[i] = new Array();
                for( j =0 ; j < this.widthIdx;j++)
                {
                    this.hasWaiter[i][j] = false;
                }
            }




            //TODO: del test data
            var addItem = new cc.MenuItemImage(
                s_CloseNormal,
                s_CloseSelected,
                function () {
                    cc.log("add");
                    g_counter++;

                    this.addWaiter(g_counter,s_Photo,g_counter.toString());
                },this);
            var addMenu = new cc.Menu(addItem);
            addMenu.setPosition(70, 70);
            this.addChild(addMenu);
            addItem.setPosition(100,100);


            var delItem = new cc.MenuItemImage(
                s_CloseNormal,
                s_CloseSelected,
                function () {
                    cc.log("add");
                    var randomFrameNum = Math.floor(Math.random() * g_counter + 1);
                    cc.log("del"+ randomFrameNum.toString());
                    this.delWaiter(randomFrameNum);
                },this);
            var delMenu = new cc.Menu(delItem);
            delMenu.setPosition(100, 70);
            this.addChild(delMenu);
            addItem.setPosition(100,200);


            this.xGap = size.width/this.widthIdx;
            this.yGap = size.height/this.heightIdx;
        }


     },
    addWaiter:function(id, photo,name){
        var newWaitRunner = new WaitRunner();
        var size = cc.director.getWinSize();
        newWaitRunner.init(id,photo,name);
        var x = 0;
        var y = 0;
        var mark = false;
        for( x = 0; x < this.heightIdx; x++ )
        {
            for(y = 0; y < this.widthIdx; y++)
            {
                if(this.hasWaiter[x][y] == false)
                {
                    mark = true;
                    break;
                }
            }
            if(mark)
                break;
        }
        cc.log(x.toString());
        cc.log(y.toString());
        var size = cc.director.getWinSize();
        newWaitRunner.xIdx = x;
        newWaitRunner.yIdx = y;
        newWaitRunner.setPosition(cc.p(x*this.xGap+ 50,size.height - y *this.yGap - 90));
        this.hasWaiter[x][y] = true;
        this.addChild(newWaitRunner);
        this.waiterArr[id] = newWaitRunner;
    },

    delWaiter:function(id)
    {
        var delWaitRunner = this.waiterArr[id];
        this.removeChild(delWaitRunner);
        this.hasWaiter[delWaitRunner.xIdx][delWaitRunner.yIdx] = false;
    }

});