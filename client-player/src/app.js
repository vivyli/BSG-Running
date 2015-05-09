
var GameControllerLayer = cc.Layer.extend({
    background:null,
    sprite:null,
    shake:null,
    rankLabel:null,
    _sensorDatas: [],
    _frequency: 30,
    _valueFrequency: 7,
    hbIndex:0,
    ctor:function () {
        this._super();
        this.init();
    },
    init: function(){
        if(this._super()){
            var size = cc.winSize;

            // background
            this.background = new cc.Sprite(res.s_Background2);
            this.background.attr({
                anchorX : 0.5,
                anchorY : 0.5,
                x: GC_w/2,
                y: GC_h/2
            });
            this.addChild(this.background, 0);

            this.rankLabel = new cc.LabelTTF("", "Impact", 48);
            this.rankLabel.setPosition(size.width / 2, size.height * 0.2);
            this.addChild(this.rankLabel);

            this.login();

            // test
            // TODO
            //CLIENT_GAME_STATE = 4;
            //this.startSendingSensorData();
        }
    },
    showWinnerRank: function(rank)
    {
        rank = parseInt(rank);
        if(rank == null || rank == undefined){
            return;
        }
        if(rank == 0) {
            return;
        }
        var rankStr = "真遗憾";
        if(rank > 0){
            rankStr = "第"+rank+"名";
        }
        this.rankLabel.setString(rankStr);
    },
    showPlayerId: function()
    {
        cc.log("show Player id");
        var size = cc.winSize;
        var idLable = new cc.LabelTTF(PLAYER_ID.toString(), "Impact", 160);
        idLable.setPosition(size.width / 2, size.height * 0.8);
        this.addChild(idLable);
    },
    login: function()
    {
        var data = {};
        // TODO, fake player id
        data[NETWORK_CONSTANTS.USER_ID] = PLAYER_ID;
        data[NETWORK_CONSTANTS.GAME_ID] = CLIENT_GAME_ID;
        cc.log("send game id to server", CLIENT_GAME_ID);
        var controller = this;
        this.sendData(data, EventNetworkPlayer.Login, function(responseData){

            cc.log("### login recv, start hb");
            cc.log(responseData);

            PLAYER_ID = parseInt(responseData);
            controller.showPlayerId();
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
        cc.log("startSendingSensorData");
        this._startSendingSensorData();
        this.schedule(this._realSendSensorData, 0.3);
    },
    _realSendSensorData: function()
    {
        cc.log("_realSendSensorData");

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
        var self = this;
        this.sendData(data, EventNetworkPlayer.Sensor, function (responseData) {
            cc.log(responseData);
            self.showWinnerRank(responseData);
        });

        if(CLIENT_GAME_STATE && (GAME_STATE.RUNNING > CLIENT_GAME_STATE || CLIENT_GAME_STATE >= GAME_STATE.FINISHED)) {
            this.stopSendingSensorData();
        }
    },
    _startSendingSensorData: function()
	{
        cc.log("_startSendingSensorData");
		if( 'accelerometer' in cc.sys.capabilities ) {
			// call is called 30 times per second
            var idx = 0;
			cc.inputManager.setAccelerometerInterval(1/this._frequency);
			//this._cc_setAccelerometerInterval(1/this._frequency);
			cc.inputManager.setAccelerometerEnabled(true);
			//this._cc_setAccelerometerEnabled(true);
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
        this.schedule(this._startSendingHeartBeatData, 2);
    },
    _startSendingHeartBeatData: function()
    {
        cc.log("hb index", this.hbIndex);
        this.hbIndex = this.hbIndex+1;
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
                if (gameState >= GAME_STATE.RUNNING) {
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
        this.unschedule(this._startSendingHeartBeatData);
    },
	sendData: function(data, serverEvent, callback, istest, testhost)
	{
        var url = NETWORK_CONSTANTS.SERVER_HOST + ":" + NETWORK_CONSTANTS.SERVER_PORT + "/" + serverEvent;
        if(istest) {
            url = testhost+":8888" + "/" + serverEvent;
        }

        var xhr = cc.loader.getXMLHttpRequest();
        xhr.open("POST", url);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status <= 207)) {
                callback(xhr.response);
            }
        };
        var dataString = "";
        var isFirst = true;
        for (var key in data) {
            if (!isFirst) {
                dataString += "&";
            } else {
                isFirst = false;
            }
            dataString += key + "=" + data[key];
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

