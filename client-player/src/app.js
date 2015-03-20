
var GameControllerLayer = cc.Layer.extend({
    sprite:null,
    _sensorDatas: [],
    _frequency: 30,
    _valueFrequency: 10,
    ctor:function () {
        this._super();
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
            rotation: 0
        });
        this.addChild(this.sprite, 0);

        this.login();

        // test
        // TODO
        //CLIENT_GAME_STATE = 3;
        //this.startSendingSensorData();

        return true;
    },
    login: function()
    {
        var data = {};
        // TODO, fake player id
        data[NETWORK_CONSTANTS.USER_ID] = PLAYER_ID;
        var controller = this;
        this.sendData(data, EventNetworkPlayer.Login, function(responseData){
            cc.log("### login recv, start hb");
            cc.log(responseData);

            controller.startSendingHeartBeatData();
        });
    },
    stopSendingSensorData: function()
    {
        cc.log("### stop Sensor Data");

        this.unschedule(this._realSendSensorData);

        if( 'accelerometer' in cc.sys.capabilities ) {
            cc.eventManager.removeListeners(cc.EventListener.ACCELERATION);
            cc.inputManager.setAccelerometerEnabled(false);
        }
    },
    startSendingSensorData: function()
    {
        this._startSendingSensorData();
        this.schedule(this._realSendSensorData, 0.3);
    },
    _realSendSensorData: function()
    {
        if(this._sensorDatas.length < this._valueFrequency)
        {
            return;
        }

        function median(values) {
            values.sort( function(a,b) {return a - b;} );
            var half = Math.floor(values.length/2);
            return values[half];
        }
        var sensorData = median(this._sensorDatas);

        var data = {};
        var ret = sensorData;
        data[NETWORK_CONSTANTS.SHAKE_DATA] = ret;
        data[NETWORK_CONSTANTS.USER_ID] = PLAYER_ID;
        cc.log("### send data: "+ret);
        this.sendData(data, EventNetworkPlayer.Sensor, function (responseData) {
            cc.log("### senor recv");
            cc.log(responseData);
        });

        if(CLIENT_GAME_STATE && (GAME_STATE.READY_TO_START > CLIENT_GAME_STATE || CLIENT_GAME_STATE >= GAME_STATE.FINISHED)) {
            target.stopSendingSensorData();
        }
    },
	_startSendingSensorData: function()
	{
        cc.log("### start Sensor Data");
		if( 'accelerometer' in cc.sys.capabilities ) {
			// call is called 30 times per second
            var idx = 0;
			cc.inputManager.setAccelerometerInterval(1/this._frequency);
			cc.inputManager.setAccelerometerEnabled(true);
			cc.eventManager.addListener({
				event: cc.EventListener.ACCELERATION,
				callback: function(accelEvent, event){
					var target = event.getCurrentTarget();
					var x = accelEvent.x;
					var y = accelEvent.y;
                    var z = accelEvent.z;
                    var sData = Math.abs(x)*Math.abs(x) + Math.abs(y)*Math.abs(y) + Math.abs(z)*Math.abs(z);

					// for Low pass filter, median
                    idx = idx % target._valueFrequency;
                    target._sensorDatas[idx] = sData;
                    idx = idx + 1;
				}
			}, this);
		} else {
			cc.log("ACCELEROMETER not supported");
		}
	},
    startSendingHeartBeatData: function()
    {
        this.schedule(this._startSendingHeartBeatData, 1);
    },
    _startSendingHeartBeatData: function()
    {
        if(PLAYER_ID==undefined || !PLAYER_ID)  {
            return;
        }
        var controller = this;
        var data = {};
        data[NETWORK_CONSTANTS.USER_ID] = PLAYER_ID;
        this.sendData(data, EventNetworkPlayer.HeartBeat, function(responseData){
            cc.log("### heartbeat recv");
            cc.log(responseData);

            var gameState = parseInt(responseData);
            if(gameState) {
                CLIENT_GAME_STATE = gameState;
                if (gameState >= GAME_STATE.READY_TO_START) {
                    cc.log("### stop hb, start sensor data");
                    controller.stopSendingHeartBeatData();
                    controller.startSendingSensorData();
                }
            }
        });
    },
    stopSendingHeartBeatData: function()
    {
        cc.log("### stop hb func");
        this.unschedule(this.startSendingHeartBeatData);
    },
	sendData: function(data, serverEvent, callback)
	{
		var xhr = cc.loader.getXMLHttpRequest();
        var url = NETWORK_CONSTANTS.SERVER_HOST_PL+"/"+serverEvent;
        cc.log(url);
		xhr.open("POST", url);
		xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		xhr.onreadystatechange = function () {
			if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status <= 207)) {
                callback(xhr.response);
            }
        };
        var dataString = "";
        var isFirst = true;
        for(var key in data)
        {
            if(!isFirst){
                dataString += "&";
            } else {
                isFirst = false;
            }
            dataString += key+"="+data[key];
        }
        xhr.send(dataString);
	}
});

var GameControllerScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new GameControllerLayer();
        this.addChild(layer);
    }
});

