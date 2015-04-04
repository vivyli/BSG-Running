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
            this.prepareLabel = new cc.LabelTTF("等待阶段", "Impact", 38);
            // position the label on the center of the screen
            this.prepareLabel.setPosition(size.width / 2+130, size.height - 55);
            // add the label as a child to this layer
            this.addChild(this.prepareLabel, 5,202);


            var startItem = new cc.MenuItemImage(
                s_StartGameUp,
                s_StartGameDown,
                function () {
                    ControlLayer._getInstance().StartGame();
                },this);

            var menu = new cc.Menu(startItem);
            menu.setPosition(0, 0);
            this.addChild(menu, 1,102);

            startItem.setPosition(cc.p(750,50));
            startItem.setScale(0.5);


            var qrCode = new cc.Sprite(s_Qrcode);
            qrCode.setAnchorPoint(cc.p(0,0))
            qrCode.setPosition(cc.p(550,100));
            qrCode.setScale(1.5,2);
            this.addChild(qrCode);


            this.waiterArr = new Array();
            this.hasWaiter = new Array();
            for(i = 0; i < this.heightIdx;i++)
            {
                this.hasWaiter[i] = new Array();
                for( j =0 ; j < this.widthIdx;j++)
                {
                    this.hasWaiter[i][j] = false;
                }
            }

            var countDown = new CountDown();
            countDown.init(120);
            this.addChild(countDown);



            //TODO: del test data
            var addItem = new cc.MenuItemImage(
                s_CloseNormal,
                s_CloseSelected,
                function () {
                    cc.log("add");
                    g_counter++;
                    var logoData = "data:image/jpg;base64,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";
                    this.addWaiter(g_counter,logoData,g_counter.toString());
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


            this.xGap = 500 /this.widthIdx;
            this.yGap = (size.height-10)/this.heightIdx;
        }


     },


    addWaiter:function(id, photo,name){

        var size = cc.director.getWinSize();

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
        if(x >= this.heightIdx || y >= this.widthIdx)
            return false;
        var newWaitRunner = new WaitRunner();
        newWaitRunner.init(id,photo,name);
        var size = cc.director.getWinSize();
        newWaitRunner.xIdx = x;
        newWaitRunner.yIdx = y;
        newWaitRunner.setPosition(cc.p(x*this.xGap+ 60,size.height - y *this.yGap - 100));
        this.hasWaiter[x][y] = true;
        this.addChild(newWaitRunner);
        this.waiterArr[id] = newWaitRunner;
        return true;
    },

    delWaiter:function(id)
    {
        var delWaitRunner = this.waiterArr[id];
        this.removeChild(delWaitRunner);
        this.hasWaiter[delWaitRunner.xIdx][delWaitRunner.yIdx] = false;
    }

});