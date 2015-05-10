/**
 * Created by chunmato on 15/3/16.
 */

require('../common/commonDefs.js');

var util = require('./util.js');
var http = require('http');
var url = require("url");
var querystring = require('querystring');

var runner_processor = require('./processor/runner_processor');
var log = require('./log.js');
var config = require('./config.js');
var workflow = require('./workflow.js');

var uc_events = {};
uc_events.actions = {};

// Route function for the request from user client.
uc_events.route = function(request, response) {
    var action = url.parse(request.url).pathname.split('/')[1];

    // Ignore socket.io request.
    if (action == 'socket.io')
        return true;

    if (typeof uc_events.actions[action] == 'function') {
        request.connection.setTimeout(0);
        uc_events.actions[action].apply(uc_events, [request, response]);
        return true;
    }

    return false;
};

// PL_sensor event - UC will post data with user info and shake info
uc_events.actions[EventNetworkPlayer.Sensor] = function(request, response) {
    if (request.method == 'POST') {
        util.handlePostRequest(request, function(object_post_data){
            var shake_data = object_post_data[NETWORK_CONSTANTS.SHAKE_DATA];
            var user_id = object_post_data[NETWORK_CONSTANTS.USER_ID];
            var user_agent_str = request.headers['user-agent'];
            var user_agent = 0;
            if (user_agent_str.indexOf('iPhone') != -1)
                user_agent = 1;
            var game = game_manager.get_game_by_user_id(user_id);
            log.log_with_color('sensor data received! shake_data=' + shake_data + ' user_id=' + user_id, 'yellow');
            if (workflow.check_accept_event(game == null ? null : game.game_state, EventNetworkPlayer.Sensor)) {
                if (game.game_state == GAME_STATE.FINISHED) // If game is finished, send back runner's rank.
                    runner_processor.send_rank(user_id, response);
                else {
                    runner_processor.process(user_id, shake_data, user_agent);
                    util.send_text_response(response, '0');
                }
            }
            else {
                // TODO Notify not accept this event
                log.log_with_color('[Error] Sensor data not accepted!', Log_Config.error_color);
            }
        });
    }
    else if (request.method == "GET") {
        // TEST
        runner_processor.process(111, 11);
        util.send_text_response(response, "hello");
    }

};

// PL_heart_beat: Need parameters {user_id: uid}
// Indicate this user is alive. If we didn't receive the specified user's heart beat for a while.
// We can kick this user out of game in game preparation stage.
uc_events.actions[EventNetworkPlayer.HeartBeat] = function(request, response) {
    if (request.method == 'POST') {
        util.handlePostRequest(request, function(object_post_data){
            var user_id = object_post_data[NETWORK_CONSTANTS.USER_ID];
            var game = game_manager.get_game_by_user_id(user_id);

            if(workflow.check_accept_event(game == null ? null : game.game_state, EventNetworkPlayer.HeartBeat)) {
                runner_processor.heart_beat(user_id);
                if (game != null && game != undefined) {
                    var game_state = GAME_STATE.RESERVED;
                    game_state = game.game_state;

                    if (__DEBUG__ == 1)
                        log.log_with_color('[HB][GameState]: ' + game_state, Log_Config.uc_log_default_color);
                    util.send_text_response(response, (''+ game_state));
                }
                else {
                    log.log_with_color('[Error] No game instance in HB!', Log_Config.error_color);
                }
            }
            else {
                log.log_with_color('[HB]user(' + user_id + ') is not accepted!', Log_Config.error_color);
                util.send_text_response(response, ('' + GAME_STATE.RESERVED));
            }
        });
    }
    else if (request.method == "GET") {
        // TEST
        runner_processor.heart_beat(111);
        util.send_text_response(response, "heart beat");
    }

};

// PL_login: Need parameters {user_id: uid, game_id: gid}
// When received a new user's login request, register this user to the game.
uc_events.actions[EventNetworkPlayer.Login] = function(request, response) {
    log.log_with_color('[Req][Player] Login', Log_Config.request_color);
    if (request.method == "POST") {
        util.handlePostRequest(request, function(object_post_data){
            var game_id = object_post_data[NETWORK_CONSTANTS.GAME_ID];
            console.log('game_id = ' + game_id);
            var game = game_manager.get_game(game_id);
            //console.log('[Login][game_state]' + game.game_state);
            if (game != null && workflow.check_accept_event(game.game_state, EventNetworkPlayer.Login) && game.can_join()) {
                var user_id = game.new_user_id();
                runner_processor.register_runner(user_id, game_id);
                var game_state = GAME_STATE.RESERVED;
                if (game != null)
                    game_state = game.game_state;
                util.send_text_response(response, (''+ user_id));
            }
            else{
                // TODO Notify not accept this event
                console.log(game.game_state);
                log.log_with_color(EventNetworkPlayer.Login + ' not accept!', Log_Config.error_color);
            }
        });
    }
    else if (request.method == "GET") {
        // TEST
        runner_processor.register_runner(11);
        util.send_text_response(response, "login");
    }

};

// TEST!
uc_events.actions['testa'] = function(request, response) {
    console.log('testa');
    if (request.method == "POST") {
        util.handlePostRequest(request, function(object_post_data){
            //console.log(object_post_data['data']);
            util.send_text_response(response, object_post_data['data']);
        });
    }
};
// TEST

function route(request, response) {
    if (!uc_events.route(request, response)) {
        log.log_with_color('[ERROR] bad request: ' + request.url, Log_Config.error_color);
        response.writeHead(404);
        response.end();
    }
}

//uc server
function start(port) {
    log.log_with_color("uc server started with port " + port, Log_Config.uc_log_default_color);
    http.createServer(function(request, response) {
        if (!uc_events.route(request, response)) {
            log.log_with_color('[ERROR] bad request: ' + request.url, Log_Config.error_color);
            response.writeHead(404);
            response.end();
        }
    }).listen(port);
}

exports.start = start;
exports.route = route;