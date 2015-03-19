/**
 * Created by chunmato on 15/3/16.
 */

require('../common/commonDefs.js'); // Load common event name definition.
var Game = require('./objects/game.js');
var GameManager = require('./objects/game_manager.js');
var Runner = require('./objects/runner.js');

var uc_server = require('./bsg_uc_server');
var sc_server = require('./bsg_sc_server');

var uc_port = 7777;
var sc_port = 9999;

// A global game manager
game_manager = new GameManager();

// TEST
//var id = 111;
//game_manager.game = new Game();
//game_manager.game.runners[id] = new Runner(id);
//game_manager.game.game_state = GAME_STATE.WAITING_FOR_PLAYERS;
//END TEST

uc_server.start(uc_port);
sc_server.start(sc_port);