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

    qrcode:"",
    init:function()
    {
        this.players = [];
        this.winners = [];
        this.socket = io(NETWORK_CONSTANTS.SERVER_HOST+":"+NETWORK_CONSTANTS.SERVER_PORT);
        this.registerSocketEvent();

        cc.log("server:", NETWORK_CONSTANTS.SERVER_HOST+":"+NETWORK_CONSTANTS.SERVER_PORT);
    },
    ResetGame: function ()
    {
        cc.log("### led reset game")
        this.players = [];
        this.winners = [];
        GameRoles.sort(function(a,b){ return Math.random()>.5 ? -1 : 1;});
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
                var mapCount = function(map){
                    var count = 0;
                    for(var k in map){
                        count = count + 1;
                    }
                    return count;
                };

                cc.log(playerObj);

                var playerCount = mapCount(controlLevel.players);
                var idx = playerCount-1;
                idx = idx <= 0 ? 0 : idx;
                controlLevel.players[playerId][NETWORK_CONSTANTS.USER_ROLE] = GameRoles[playerCount-1];

                cc.log("player role", controlLevel.players[playerId][NETWORK_CONSTANTS.USER_ROLE]);

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
    getImgSpriteWithData: function(imgData){
        cc.log("### img", imgData);
        var logoData = imgData;
        //var logoData = "data:image/jpg;base64,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";
        var logoTexture = new Image();
        logoTexture.src = logoData;
        logoTexture.width = NETWORK_CONSTANTS.IMAGE_SIZE;
        logoTexture.height = NETWORK_CONSTANTS.IMAGE_SIZE;
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

