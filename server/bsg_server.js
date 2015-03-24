/**
 * Created by chunmato on 15/3/16.
 */

require('../common/commonDefs.js'); // Load common event name definition.

var http = require('http');
var Game = require('./objects/game.js');
var GameManager = require('./objects/game_manager.js');
//var Runner = require('./objects/runner.js');
var log = require('./log.js');

var uc_server = require('./bsg_uc_server');
var sc_server = require('./bsg_sc_server');
var socket = require('socket.io');

var test = require('./test/test.js');

//var uc_port = 7777;
//var sc_port = 9999;

// A global game manager. Can access game_manager from everywhere.
game_manager = new GameManager();

//uc_server.start(uc_port);
//sc_server.start(sc_port);


var server = http.createServer();
var io = socket(server);
server.listen(NETWORK_CONSTANTS.SERVER_PORT);

// Start SC_Server
sc_server.start(io);

// Add listener for UC_Server
server.addListener('request', function (request, response) {
    if (__TEST__ == 1) {
        if (request.url == '/test') {
            test.write_test_page(response);
        }
        else
            uc_server.route(request, response);
    }
    else
        uc_server.route(request, response);

});
log.log_with_color("uc server started with port " + NETWORK_CONSTANTS.SERVER_PORT, Log_Config.uc_log_default_color);
