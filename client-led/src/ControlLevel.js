/**
 * Created by Xinsheng Yang on 2015/3/14.
 */


ControlLayer = cc.Class.extend({
    scene:null,
    sceneName:"",
    socket:null,
	
	gameId:"",
    players:{},
    init:function()
    {
        this.players = {};

        cc.log(NETWORK_CONSTANTS.SERVER_HOST_LED);
        this.socket = io(NETWORK_CONSTANTS.SERVER_HOST_LED);
        this.registerSocketEvent();

		this.login();
    },
	login: function()
	{
        if(!this.socket) {
            return;
		} else {
            this.socket.emit(EventNetworkLED.Login, {key: "led"});
		}
	},
	StartGame: function()
	{
        if(!this.socket) {
            return;
		} else {
            this.socket.emit(EventNetworkLED.StartGame, {key: this.gameId});
            var nextScene = new MainScene();
            cc.director.runScene(new cc.TransitionSlideInR(0.4, nextScene));
		}
	},
	EndGame: function()
	{
        if(!this.socket) {
            return;
		} else {
            this.socket.emit(EventNetworkLED.EndGame, {key: this.gameId});
		}
	},
    registerSocketEvent: function()
    {
        if(!this.socket) {
            return;
        } else {
			// recv gameId
            this.socket.on(EventNetworkLED.GameID, function(data){
                cc.log("### event: "+EventNetworkLED.GameID);
                cc.log(data);

				this.gameId = data;

				// run prepare scene
				cc.log("### entering prepare scene");
				var nextScene = new PrepareScene();
				cc.director.runScene(new cc.TransitionSlideInR(0.4, nextScene));
            });

			// recv prepare state, player register
            this.socket.on(EventNetworkLED.PrepareState, function(data){
                cc.log("### event: "+EventNetworkLED.PrepareState);

                var controlLevel = ControlLayer._getInstance();
                var playerId = data[NETWORK_CONSTANTS.USER_ID];
                var playerObj = data;
                controlLevel.players[playerId] = playerObj;

				if(controlLevel.sceneName == EnumSceneName.ePrepare) {
					controlLevel.scene.registerPlayer(playerId, playerObj);
				}
			});

			// recv game state, player speed
            this.socket.on(EventNetworkLED.GameState, function(data){
                var controlLevel = ControlLayer._getInstance();
				if(controlLevel.sceneName == EnumSceneName.eMain) {
                    cc.log(data);

                    for(var playerId in data)
                    {
                        cc.log("speed:"+data[playerId]);
                        controlLevel.scene.updateRunnerSpeed(playerId, data[playerId]);
                    }
				}
            });
        }
    },
    updateScene:function(scene,sceneName)
    {
        this.scene = scene;
        this.sceneName = sceneName;
    }
});

ControlLayer.sharedDirector = null;
ControlLayer.firstUseDirector = true;

ControlLayer._getInstance = function () {
    if (ControlLayer.firstUseDirector) {
        ControlLayer.firstUseDirector = false;
        ControlLayer.sharedDirector = new ControlLayer();
        ControlLayer.sharedDirector.init();
    }
    return ControlLayer.sharedDirector;
};

