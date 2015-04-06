/**
 * Created by chunmato on 15/4/6.
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

function handler (req, res) {
    fs.readFile(__dirname + '/index.html',
        function (err, data) {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading index.html');
            }

            res.writeHead(200);
            res.end(data);
        });
}

// Calling led_processor with parameters
function process_with_game_id(game_id) {
    return function() {
        led_processor.process(game_id);
    }
}

function check_runners_alive(game_id) {
    return function () {
        led_processor.check_runners_alive(game_id);
    }
}

function start(io/* port*/) {
    log.log_with_color('uc server socket.io started with port ' + NETWORK_CONSTANTS.SERVER_PORT, Log_Config.sc_log_default_color);

    io.on('connection', function (socket) {
        log.log_with_color('[INFO] New connection!', Log_Config.sc_log_default_color);

        var check_alive_interval_id = 0;
        var game = null;
        socket.on(EventNetworkPlayer.Login, function (data) {
            var game_id = data[NETWORK_CONSTANTS.GAME_ID];
            var game = game_manager.get_game(game_id);
            //console.log('[Login][game_state]' + game.game_state);
            if (game != null && workflow.check_accept_event(game.game_state, EventNetworkPlayer.Login) && game.can_join()) {
                var user_id = game.new_user_id();
                runner_processor.register_runner(user_id, game_id);
                var game_state = GAME_STATE.RESERVED;
                if (game != null)
                    game_state = game.game_state;
                socket.emit(EventNetworkPlayer.Login, {user_id: user_id});
            }
            else{
                log.log_with_color(EventNetworkPlayer.Login + ' not accept!', Log_Config.error_color);
            }
        });

        socket.on(EventNetworkPlayer.HeartBeat, function (data){
            var user_id = data[NETWORK_CONSTANTS.USER_ID];
            var game = game_manager.get_game_by_user_id(user_id);

            if(workflow.check_accept_event(game == null ? null : game.game_state, EventNetworkPlayer.HeartBeat)) {
                runner_processor.heart_beat(user_id);
                if (game != null && game != undefined) {
                    var game_state = GAME_STATE.RESERVED;
                    game_state = game.game_state;

                    if (__DEBUG__ == 1)
                        log.log_with_color('[HB][GameState]: ' + game_state, Log_Config.uc_log_default_color);
                    socket.emit(EventNetworkPlayer.HeartBeat, {game_state: game_state});
                }
                else {
                    log.log_with_color('[Error] No game instance in HB!', Log_Config.error_color);
                }
            }
            else {
                log.log_with_color('[HB]user(' + user_id + ') is not accepted!', Log_Config.error_color);
                socket.emit(EventNetworkPlayer.HeartBeat, {game_state: GAME_STATE.RESERVED});
            }
        });

        socket.on(EventNetworkPlayer.Sensor, function (data){
            var shake_data = data[NETWORK_CONSTANTS.SHAKE_DATA];
            var user_id = data[NETWORK_CONSTANTS.USER_ID];
            var game = game_manager.get_game_by_user_id(user_id);
            log.log_with_color('sensor data received! shake_data=' + shake_data + ' user_id=' + user_id, 'yellow');
            if (workflow.check_accept_event(game == null ? null : game.game_state, EventNetworkPlayer.Sensor)) {
                runner_processor.process(user_id, shake_data);
            }
            else {
                log.log_with_color('[Error] Sensor data not accepted!', Log_Config.error_color);
            }
        });

        socket.on('disconnect', function (data){


            log.log_with_color('[INFO] Disconnected!', Log_Config.sc_log_default_color);
        });
    });
}

exports.start = start;