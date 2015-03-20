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

function start(port)
{
    var app = http.createServer(handler);
    var io =  socket(app);
    app.listen(port);

    log.log_with_color('sc server started with port ' + port, 'white');

    io.on('connection', function (socket) {
        log.log_with_color('[INFO] New connection!', 'white');
        socket.on(EventNetworkLED.Login, function (data) {
            var game = game_manager.game;
            if (game == null) {
                game = new Game(socket);
                game_manager.game = game;
            }
            game.id = 1;
            socket.emit(EventNetworkLED.GameID, {game_id: game.id});
            log.log_with_color('[LED LOGIN] game id: ' + game.id, 'white');
        });

        var interval_id = 0;
        socket.on(EventNetworkLED.StartGame, function (data){
            var game = game_manager.game;
            game.game_state = GAME_STATE.READY_TO_START;
            interval_id = setInterval(led_processor.process, EventNetworkLED.Interval);
            log.log_with_color('======== [START GAME]! =========', 'bgGreen');
           // console.log('======== [START GAME]! =========');
        });

        socket.on(EventNetworkLED.EndGame, function (data){
            var game = game_manager.game;
           // game.socket_handler.disconnect();
            clearInterval(interval_id);
            //game = null;
            if (game != null)
                game.reset();
            log.log_with_color('======== [End GAME]! =========', 'byRed');
           // console.log('======== [End GAME]! =========');
        });

        socket.on('disconnect', function (data){
            var game = game_manager.game;
            game = null;
            log.log_with_color('[INFO] Disconnected!', 'white');
           // console.log('[INFO] Disconnected!');
        });
    });
}

exports.start = start;