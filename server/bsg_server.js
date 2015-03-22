/**
 * Created by chunmato on 15/3/16.
 */

require('../common/commonDefs.js'); // Load common event name definition.

var http = require('http');
var Game = require('./objects/game.js');
var GameManager = require('./objects/game_manager.js');
var Runner = require('./objects/runner.js');

var uc_server = require('./bsg_uc_server');
var sc_server = require('./bsg_sc_server');

var uc_port = 7777;
var sc_port = 9999;

// A global game manager. Can access game_manager from everywhere.
game_manager = new GameManager();

uc_server.start(uc_port);
sc_server.start(sc_port);