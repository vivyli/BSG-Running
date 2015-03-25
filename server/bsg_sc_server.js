/**
 * Created by chunmato on 15/3/16.
 */

require('../common/commonDefs.js');

var Game = require('./objects/game.js');
var led_processor = require('./processor/led_processor.js');
var log = require('./log.js');
var config = require('./config.js');
var workflow = require('./workflow.js');

var http = require('http');
var socket = require('socket.io');
var fs = require('fs');


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

function start(io/* port*/) {
    //var app = http.createServer(handler);
    //var io =  socket(app);
    //app.listen(port);
    //app.addListener('request', handler);
   // app.listen(handler);

    log.log_with_color('sc server started with port ' + NETWORK_CONSTANTS.SERVER_PORT, Log_Config.sc_log_default_color);

    io.on('connection', function (socket) {
        log.log_with_color('[INFO] New connection!', Log_Config.sc_log_default_color);

        // Receive Login event:
        // If game is null means that we can reuse game instance.
        // Only need to update game status, incl. reset and set new game id
        // But if it is the first time receive new connection, we should create a new game instance.
        var game = null;
        socket.on(EventNetworkLED.Login, function (data) {
            if (workflow.check_accept_event(game == null? null: game.game_state, EventNetworkLED.Login)) {
                if (game != null)
                    game_manager.update_game(game);
                else
                    game = game_manager.new_game(socket);

                game.game_state = GAME_STATE.WAITING_FOR_PLAYERS;
                // Notify Led client the created game id.
                // Format: {game_id: 1}
                this.emit(EventNetworkLED.GameID, {game_id: game.id});

                log.log_with_color('[LED LOGIN] game id: ' + game.id, Log_Config.sc_log_default_color);
            }
            else {
                // TODO Notify didn't accept this event for now.
            }
        });

        // Receive StartGame event, two things:
        // 1. Change game state to READY_TO_START.
        // 2. Start sent runners' speed to LED client per Interval time.
        var interval_id = 0;
        socket.on(EventNetworkLED.StartGame, function (data){
            if (workflow.check_accept_event(game == null ? null : game.game_state, EventNetworkLED.StartGame)) {
                if (game != null) {
                    game.game_state = GAME_STATE.READY_TO_START;
                    interval_id = setInterval(process_with_game_id(game.id), EventNetworkLED.Interval);
                    log.log_with_color('======== [START GAME]! =========', Log_Config.sc_log_default_color);
                }
                else {
                    // If there is not game instance there or game state is not correct. (Game state here should be READY_TO_START)
                    // We should notify LED client to login first or game is not ready.
                    // Not finished here. TODO
                    log.log_with_color('[Error] No Game instance', Log_Config.error_color);
                }
            }
            else {
                // TODO Notify didn't accept this event for now.
            }
        });

        // Receive EndGame event, two things:
        // 1. Stop trying sending runners' speed to LED client.
        // 2. reset game. That is to clear runners and reset game state here.
        socket.on(EventNetworkLED.EndGame, function (data){
            if (workflow.check_accept_event(game == null ? null : game.game_state, EventNetworkLED.EndGame)) {
                clearInterval(interval_id);
                if (game != null)
                    game.reset();
                log.log_with_color('======== [End GAME]! =========', Log_Config.sc_log_default_color);
            }
            else {
                // TODO Notify didn't accept this event for now.
            }
        });

        // LED client disconnect.
        socket.on('disconnect', function (data){
            game = null;
            log.log_with_color('[INFO] Disconnected!', Log_Config.sc_log_default_color);
        });
    });
}

exports.start = start;