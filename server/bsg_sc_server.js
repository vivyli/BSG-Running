/**
 * Created by chunmato on 15/3/16.
 */

require('../common/commonDefs.js');
var Game = require('./objects/game.js');
var led_processor = require('./led_processor.js');

var http = require('http');
var socket = require('socket.io');
var fs = require('fs');

var log = require('./log.js');
var config = require('./config.js');

// TEST
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

// This function is to pass parameters to process function
function process_with_game_id(game_id)
{
    return function()
    {
        led_processor.process(game_id);
    }
}

function start(port)
{
    var app = http.createServer(handler);
    var io =  socket(app);
    app.listen(port);

    log.log_with_color('sc server started with port ' + port, Log_Config.sc_log_default_color);

    io.on('connection', function (socket) {
        log.log_with_color('[INFO] New connection!', Log_Config.sc_log_default_color);

        var game = null;
        socket.on(EventNetworkLED.Login, function (data) {
            if (game != null)
                game_manager.update_game(game);
            else
                game = game_manager.new_game(socket);
            socket.emit(EventNetworkLED.GameID, {game_id: game.id});
            log.log_with_color('[LED LOGIN] game id: ' + game.id, Log_Config.sc_log_default_color);
        });

        var interval_id = 0;
        socket.on(EventNetworkLED.StartGame, function (data){
            //var game = game_manager.game;
            if (game != null)
            {
                game.game_state = GAME_STATE.READY_TO_START;
                interval_id = setInterval(process_with_game_id(game.id), EventNetworkLED.Interval);
                log.log_with_color('======== [START GAME]! =========', Log_Config.sc_log_default_color);
            }
            else
            {
                log.log_with_color('[Error] No Game instance', Log_Config.error_color);
            }
        });

        socket.on(EventNetworkLED.EndGame, function (data){
            //var game = game_manager.game;
            clearInterval(interval_id);
            //game = null;
            if (game != null)
                game.reset();
            log.log_with_color('======== [End GAME]! =========', Log_Config.sc_log_default_color);
        });

        socket.on('disconnect', function (data){
            game = null;
            log.log_with_color('[INFO] Disconnected!', Log_Config.sc_log_default_color);
        });
    });
}

exports.start = start;