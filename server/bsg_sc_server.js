/**
 * Created by chunmato on 15/3/16.
 */

require('../common/commonDefs.js');
var Game = require('./objects/game.js');
var led_processor = require('./led_processor.js');

var http = require('http');
var socket = require('socket.io');
var fs = require('fs');

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

    console.log('sc server started with port ' + port);

    io.on('connection', function (socket) {
        console.log('[INFO] New connection!');
        socket.on(EventNetworkLED.Login, function (data) {
            var game = new Game(socket);
            game.id = 1;
            game_manager.game = game;
            socket.emit(EventNetworkLED.GameID, {game_id: game.id});
            console.log('[LED LOGIN] game id: ' + game.id);
        });

        // TODO@chunmato
        socket.on(EventNetworkLED.StartGame, function (data){
            var game = game_manager.game;
            game.game_state = GAME_STATE.READY_TO_START;
            setInterval(led_processor.process, EventNetworkLED.Interval);
            console.log('======== [START GAME]! =========');
        });

        socket.on('disconnect', function (data){

        });
    });
}

exports.start = start;