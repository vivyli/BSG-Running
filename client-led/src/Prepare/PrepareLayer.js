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
    init:function (width,height,qrcode) {

        var bRet = false;
        this.widthIdx = width;
        this.heightIdx = height;
        if (this._super()) {
            var size = cc.director.getWinSize();

            var background = new cc.Sprite(s_prepareBackground);
            background.setPosition(cc.p(size.width/2,size.height/2));
            this.addChild(background);

            //this.prepareLabel = new cc.LabelTTF("等待阶段", "Impact", 38);
            //this.prepareLabel.setPosition(size.width / 2+130, size.height - 55);
            //this.addChild(this.prepareLabel, 5,202);

            this.prepareLabel = new cc.Sprite(s_TimeLeft);
            this.prepareLabel.setPosition(size.width / 2+160, size.height - 60);
            this.addChild(this.prepareLabel, 5,202);


            var startItem = new cc.MenuItemImage(
                s_StartGameUp2,
                s_StartGameDown2,
                function () {
                    ControlLayer._getInstance().StartGame();
                },this);

            var menu = new cc.Menu(startItem);
            menu.setPosition(0, 0);
            this.addChild(menu, 1,102);

            startItem.setPosition(cc.p(750,50));
            startItem.setScale(0.8);


            //var qrCode = new cc.Sprite(s_Qrcode);
            //var qrCode = ControlLayer._getInstance().getImgSpriteWithData(qrcode, true);
            //qrCode.setAnchorPoint(cc.p(0,0));
            //qrCode.setPosition(cc.p(550,200));
            //qrCode.setScale(4,4);
            //this.addChild(qrCode);

            cc.textureCache.addImage(qrcode, this.texLoaded, this);


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

            this.xGap = 500 /this.widthIdx;
            this.yGap = (size.height-10)/this.heightIdx;
        }
     },

    texLoaded: function (texture) {
        if (texture instanceof cc.Texture2D) {
            var qrCode = new cc.Sprite(texture);
            qrCode.setAnchorPoint(cc.p(0,0));
            qrCode.setPosition(cc.p(550,200));
            qrCode.setScale(2.8,2.8);
            this.addChild(qrCode);
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