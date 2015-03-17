
var HelloWorldLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        cc.log("in ctor of HelloWorldLayer");
        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        var size = cc.winSize;

        // add a "close" icon to exit the progress. it's an autorelease object
        var closeItem = new cc.MenuItemImage(
            res.CloseNormal_png,
            res.CloseSelected_png,
            function () {
                cc.log("Menu is clicked!");
            }, this);
        closeItem.attr({
            x: size.width - 20,
            y: 20,
            anchorX: 0.5,
            anchorY: 0.5
        });

        var menu = new cc.Menu(closeItem);
        menu.x = 0;
        menu.y = 0;
        this.addChild(menu, 1);

        /////////////////////////////
        // 3. add your codes below...
        // add a label shows "Hello World"
        // create and initialize a label
        var helloLabel = new cc.LabelTTF("Hello World", "Arial", 38);
        // position the label on the center of the screen
        helloLabel.x = size.width / 2;
        helloLabel.y = 0;
        // add the label as a child to this layer
        this.addChild(helloLabel, 5);

        // add "HelloWorld" splash screen"
        this.sprite = new cc.Sprite(res.HelloWorld_png);
        this.sprite.attr({
            x: size.width / 2,
            y: size.height / 2,
            scale: 0.5,
            rotation: 180
        });
        this.addChild(this.sprite, 0);

        this.sprite.runAction(
            cc.sequence(
                cc.rotateTo(2, 0),
                cc.scaleTo(2, 1, 1)
            )
        );
        helloLabel.runAction(
            cc.spawn(
                cc.moveBy(2.5, cc.p(0, size.height - 40)),
                cc.tintTo(2.5,255,125,0)
            )
        );

        this.sendData("hehehehehehe");

        return true;
    },
    registerAccelerator: function()
    {
        if( 'accelerometer' in cc.sys.capabilities ) {
            // call is called 30 times per second
            cc.inputManager.setAccelerometerInterval(1/3);
            cc.inputManager.setAccelerometerEnabled(true);
            cc.eventManager.addListener({
                event: cc.EventListener.ACCELERATION,
                callback: function(accelEvent, event){
                    var target = event.getCurrentTarget();
                    cc.log('Accel x: '+ accelEvent.x + ' y:' + accelEvent.y + ' z:' + accelEvent.z + ' time:' + accelEvent.timestamp );

                    var w = winSize.width;
                    var h = winSize.height;

                    var x = accelEvent.x;
                    var y = accelEvent.y;
                    var z = accelEvent.z;

                    // Low pass filter
                    x = x*0.5 + target.prevX*0.5;
                    y = y*0.5 + target.prevY*0.5;
                    z = z*0.5 + target.prevZ*0.5;

                    target.prevX = x;
                    target.prevY = y;
                    target.prevZ = z;

                    var aVal = Math.abs(x) + Math.abs(y) + Math.abs(z);
                    target.sendData(aVal);
                }
            }, this);
            this.prevX = 0;
            this.prevY = 0;
            this.prevZ = 0;
        } else {
            cc.log("ACCELEROMETER not supported");
        }
    },
    sendData: function(data)
    {
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.open("GET", "http://192.168.10.107:7777/hello", true);

        xhr.onreadystatechange = function () {
            cc.log(xhr);
            cc.log(xhr.status);
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status <= 207)) {
                var response = xhr.responseText.substring(0, 100) + "...";
                cc.log(response);
            }
        };
        xhr.send();
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

