/**
 * Created by Xinsheng Yang on 2015/3/14.
 */


ControlLayer = cc.Class.extend({
    scene:null,
    sceneName:"",
    socket:null,
	
	gameId:"",
    players:[],
    winners:[],
    roleIdx:0,

    qrcode:"",
    init:function()
    {
        this.players = [];
        this.winners = [];
        this.socket = io(NETWORK_CONSTANTS.SERVER_HOST+":"+NETWORK_CONSTANTS.SERVER_PORT);
        this.registerSocketEvent();

        cc.log("server:", NETWORK_CONSTANTS.SERVER_HOST+":"+NETWORK_CONSTANTS.SERVER_PORT);

        if (QRCODE_ID != undefined && QRCODE_ID != null) {
            this.socket.emit(EventNetworkLED.WXqrcode, {"SC_WX_qrcode": QRCODE_ID});
            cc.log("### server emit qrcode id", QRCODE_ID);
        }
    },
    ResetGame: function ()
    {
        cc.log("### led reset game")
        this.players = [];
        this.winners = [];
        GameRoles.sort(function(a,b){ return Math.random()>.5 ? -1 : 1;});
        this.roleIdx = 0;
        //this.Login();
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
	StartGameToServer: function()
    {
        if(!this.socket) {
            return;
        } else {
            cc.log("### led emmit start game,,2");
            this.socket.emit(EventNetworkLED.StartGame, {key: this.gameId});
        }
    },
	StartGame: function()
	{
        if(!this.socket) {
            return;
		} else {
            cc.log("### led run start game scene,,1");
            //this.socket.emit(EventNetworkLED.StartGame, {key: this.gameId});
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
            var rankInfo = [];
            for(var i in this.winners) {
                rankInfo[i] = this.winners[i][NETWORK_CONSTANTS.USER_ID];
            }
            this.socket.emit(EventNetworkLED.EndGame, {key: this.gameId, rankInfo: rankInfo});
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
            var self = this;
            this.socket.on(EventNetworkLED.GameID, function(data){
                self.gameId = data[NETWORK_CONSTANTS.GAME_ID];
                self.qrcode = data[NETWORK_CONSTANTS.QRCODE_DATA];

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

                cc.log(playerObj);

                var playerCount = controlLevel.roleIdx;
                controlLevel.roleIdx = (controlLevel.roleIdx+1)%GameRoles.length;
                controlLevel.players[playerId][NETWORK_CONSTANTS.USER_ROLE] = GameRoles[playerCount];

                cc.log("player role", controlLevel.roleIdx, controlLevel.players[playerId][NETWORK_CONSTANTS.USER_ROLE]);

				if(controlLevel.sceneName == EnumSceneName.ePrepare) {
					controlLevel.scene.registerPlayer(playerId, controlLevel.players[playerId]);
				}
			});

            // recv unprepare state, player unregister
            this.socket.on(EventNetworkLED.UnPrepareState, function(data){
                cc.log("### event: "+EventNetworkLED.UnPrepareState);

                var controlLevel = ControlLayer._getInstance();
                var playerId = data[NETWORK_CONSTANTS.USER_ID];
                var playerObj = data;
                delete controlLevel.players[playerId];

                cc.log("unregister id", playerId);
                if(controlLevel.sceneName == EnumSceneName.ePrepare) {
                    controlLevel.scene.unRegisterPlayer(playerId, playerObj);
                }
            });

			// recv game state, player speed
            this.socket.on(EventNetworkLED.GameState, function(data){
                var controlLevel = ControlLayer._getInstance();
				if(controlLevel.sceneName == EnumSceneName.eMain) {
                    cc.log(data);

                    for(var playerId in data)
                    {
                        controlLevel.scene.updateRunnerSpeed(playerId, data[playerId]);
                    }
				}
            });

            // recv wx qrcode data
            this.socket.on(EventNetworkLED.WXqrcodeResult, function(data){
                QRCODE_DATA = data;
                var controlLevel = ControlLayer._getInstance();
                if(controlLevel.sceneName == EnumSceneName.eWelcome) {
                    cc.log("### wx qrcode received.", QRCODE_DATA);
                    controlLevel.scene.onWXqrcodeReceived();
                }
            });
        }
    },
    updateScene:function(scene,sceneName)
    {
        this.scene = scene;
        this.sceneName = sceneName;
    },
    addWinner: function(idx, playerId)
    {
        this.winners[idx] = this.players[playerId];
    },
    // utilities
    getRandomRole: function()
    {
        GameRoles.sort(function(a,b){ return Math.random()>.5 ? -1 : 1;});
        return GameRoles[0];
    },
    getMaskSprite: function(spriteRes)
    {
        var stencil = new cc.Sprite(s_PhotoMask);   //sprite or DrawNode

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
    getImgSpriteWithData: function(imgData, isQrcode){
        var logoData = imgData;
        var logoTexture = new Image();
        logoTexture.src = logoData;
        logoTexture.width = NETWORK_CONSTANTS.IMAGE_SIZE;
        logoTexture.height = NETWORK_CONSTANTS.IMAGE_SIZE;
        if(isQrcode){
            logoTexture.width = NETWORK_CONSTANTS.QRCODE_SIZE;
            logoTexture.height = NETWORK_CONSTANTS.QRCODE_SIZE;
        }
        return new cc.Sprite(logoTexture);
    },
    getMaskSpriteWithData: function(imgData)
    {
        var stencil = new cc.Sprite(s_PhotoMask);   //sprite or DrawNode

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
        var sprite = this.getImgSpriteWithData(imgData);
        // add template
        clipper.addChild(sprite);

        return clipper;
    },
    setPlayerPhotoName: function(layer, name, sPhoto, gender, c, type)
    {
        // type 1: runner
        //var x_offset = 0;
        //var y_offset = 80;
        var x_offset = 80;
        var y_offset = 0;

        // type 2: award
        if(type==2)
        {
            x_offset = 280;
            y_offset = 0;
        }

        var xOffset = [x_offset, x_offset+65, x_offset+55]; // photo, gender, name
        var yOffset = -30;
        var sGender = "award_head_gender2"+gender+".png";

        // photo
        var photoBox = new cc.Sprite(s_PhotoBox);
        photoBox.setPosition(cc.p(xOffset[0],y_offset));
        layer.addChild(photoBox);
        // debug by zzm
        var photo = this.getMaskSpriteWithData(sPhoto);
        //var photo = this.getImgSpriteWithData(sPhoto);
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
        nameLabel.setColor(c, 700);
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

