/**
 * Created by chunmato on 15/3/16.
 */

require('../common/commonDefs.js');

var util = require('./util.js');
var http = require('http');
var url = require("url");
var querystring = require('querystring');
var runner_processor = require('./runner_processor');

var uc_events = {};
uc_events.actions = {};

uc_events.route = function(request, response) {
    var action = url.parse(request.url).pathname.split('/')[1];
    //console.log('action received: ' + action);
    if (typeof uc_events.actions[action] == 'function') {
        request.connection.setTimeout(0);   // ?
        uc_events.actions[action].apply(uc_events, [request, response]);
        return true;
    }

    return false;
};

// PL_sensor event - UC will post data with user info and shake info
uc_events.actions[EventNetworkPlayer.Sensor] = function(request, response) {
    if (request.method == 'POST')
    {
        util.handlePostRequest(request, function(object_post_data){
            var shake_data = object_post_data[NETWORK_CONSTANTS.SHAKE_DATA];
            var user_id = object_post_data[NETWORK_CONSTANTS.USER_ID];
            // TODO@chunmato - Should check parameters state
            runner_processor.process(user_id, shake_data);
        });
    }
    else if (request.method == "GET")
    {
        // TEST
        runner_processor.process(111, 11);
        util.send_text_response(response, "hello");
    }

}

// PL_heart_beat
uc_events.actions[EventNetworkPlayer.HeartBeat] = function(request, response) {
    if (request.method == 'POST')
    {
        util.handlePostRequest(request, function(object_post_data){
            var user_id = object_post_data[NETWORK_CONSTANTS.USER_ID];
            runner_processor.heart_beat(user_id);

            var game_state = GAME_STATE.RESERVED;
            if (game_manager.game != null)
                game_state = game_manager.game.game_state;
            util.send_text_response(response, (''+ game_state));
        });
    }
    else if (request.method == "GET")
    {
        // TEST
        runner_processor.heart_beat(111);
        util.send_text_response(response, "heart beat");
    }

}

// PL_login
uc_events.actions[EventNetworkPlayer.Login] = function(request, response) {
    if (request.method == "POST")
    {
        util.handlePostRequest(request, function(object_post_data){
            var user_id = object_post_data[NETWORK_CONSTANTS.USER_ID];
            runner_processor.register_runner(user_id);
            var game_state = GAME_STATE.RESERVED;
            if (game_manager.game != null)
                game_state = game_manager.game.game_state;
            util.send_text_response(response, (''+ game_state));
        });
    }
    else if (request.method == "GET")
    {
        // TEST
        runner_processor.register_runner(11);
        util.send_text_response(response, "login");
    }

}

//uc server
function start(port)
{
    console.log("uc server started with port " + port);
    http.createServer(function(request, response) {
        if (!uc_events.route(request, response)) {
            console.log('[ERROR] bad request: ' + request.url);
            response.writeHead(404);
            response.end();
        }
    }).listen(port);
}

exports.start = start;