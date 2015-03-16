/**
 * Created by Xinsheng Yang on 2015/3/14.
 */


ControlLayer = cc.Class.extend({
    scene:null,
    sceneName:"",
    socket:null,
    init:function()
    {
        this.socket = io(NETWORK_CONSTANTS.SERVER_HOST);
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
            this.socket.emit(EventNetworkLED.StartGame, {key: "led"});
		}
	},
	EndGame: function()
	{
        if(!this.socket) {
            return;
		} else {
            this.socket.emit(EventNetworkLED.EndGame, {key: "led"});
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
            });

			// recv prepare state, player register
            this.socket.on(EventNetworkLED.PrepareState, function(data){
                cc.log("### event: "+EventNetworkLED.PrepareState);
                cc.log(data);
            });

			// recv game state, player speed
            this.socket.on(EventNetworkLED.GameState, function(data){
                cc.log("### event: "+EventNetworkLED.GameState);
                cc.log(data);
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

