/**
 * Created by Xinsheng Yang on 2015/3/14.
 */


ControlLayer = cc.Class.extend({
    scene:null,
    sceneName:"",
    socket:null,
	
	gameId:"",
    players:[],
    init:function()
    {
        this.players = [];
        this.socket = io(NETWORK_CONSTANTS.SERVER_HOST+":"+NETWORK_CONSTANTS.SERVER_PORT);
        this.registerSocketEvent();

        cc.log("server:", NETWORK_CONSTANTS.SERVER_HOST+":"+NETWORK_CONSTANTS.SERVER_PORT);
    },
    ResetGame: function ()
    {
        cc.log("### led reset game")
        this.players = [];
        this.Login();
    },
	Login: function()
	{
        if(!this.socket) {
            return;
		} else {
            cc.log("### led emmit login");
            var data = {};
            this.socket.emit(EventNetworkLED.Login, {NETWORK_CONSTANTS: this.gameId});
		}
	},
	StartGame: function()
	{
        if(!this.socket) {
            return;
		} else {
            cc.log("### led emmit start game");
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
            cc.log("### led emmit end game");
            this.socket.emit(EventNetworkLED.EndGame, {key: this.gameId});
            var nextScene = new AwardScene();
            cc.director.runScene(new cc.TransitionSlideInR(0.4, nextScene));
		}
	},
    registerSocketEvent: function()
    {
        if(!this.socket) {
            return;
        } else {
			// recv gameId
            this.socket.on(EventNetworkLED.GameID, function(data){
                this.gameId = data;

				// run prepare scene
				cc.log("### server send prepare game");
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

            // recv unprepare state, player unregister
            this.socket.on(EventNetworkLED.UnPrepareState, function(data){
                cc.log("### event: "+EventNetworkLED.UnPrepareState);

                var controlLevel = ControlLayer._getInstance();
                var playerId = data[NETWORK_CONSTANTS.USER_ID];
                var playerObj = data;
                delete controlLevel.players[playerId];

                if(controlLevel.sceneName == EnumSceneName.ePrepare) {
                    controlLevel.scene.unRegisterPlayer(playerId, playerObj);
                }
            });

			// recv game state, player speed
            this.socket.on(EventNetworkLED.GameState, function(data){
                var controlLevel = ControlLayer._getInstance();
				if(controlLevel.sceneName == EnumSceneName.eMain) {
                    //cc.log(data);

                    for(var playerId in data)
                    {
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
    },
    // utilities
    getMaskSprite: function(spriteRes)
    {
        var stencil = new cc.Sprite("head_mask.png");   //sprite or DrawNode

        //1.create clipping node
        var clipper = new cc.ClippingNode();
        clipper.setInverted(false);

        //2.set template
        clipper.setStencil(stencil);

        // alpha threshold：pixel transparency
        // if alpha of pixel in template(stencil) > Threshold, pixel will be rendered
        // alpha threshold: [0,1]. default 1
        // default 1, alpha test is closed, all pixels will be rendered
        // if not 1, alpha > threshold, pixel will be rendered
        clipper.setAlphaThreshold(0.1);

        //3. create sprite
        var sprite = new cc.Sprite(spriteRes);
        // add template
        clipper.addChild(sprite);

        return clipper;
    },
    setPlayerPhotoName: function(layer, name, sPhoto, gender, c, type)
    {
        var x_offset = 0;
        var y_offset = 80;
        if(type==2)
        {
            x_offset = 280;
            y_offset = 0;
        }

        var xOffset = [x_offset, x_offset+65, x_offset+55]; // photo, gender, name
        var yOffset = -30;
        var sGender = "award_head_gender2"+gender+".png";

        // photo
        var photoBox = new cc.Sprite(sPhoto);
        photoBox.setPosition(cc.p(xOffset[0],y_offset));
        layer.addChild(photoBox);
        var photo = this.getMaskSprite(s_Photo);
        photo.setPosition(cc.p(xOffset[0],y_offset));
        layer.addChild(photo);

        // gender label
        var genderIcon = new cc.Sprite(sGender);
        genderIcon.setPosition(cc.p(xOffset[1], yOffset+y_offset));
        layer.addChild(genderIcon);

        // name label
        var nameLabel = new cc.LabelTTF(name, "Impact", 20);
        nameLabel.setAnchorPoint(cc.p(0,0.5));
        nameLabel.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
        nameLabel.setPosition(cc.p(xOffset[2], y_offset));
        nameLabel.setColor(c);
        layer.addChild(nameLabel);
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

