/**
 * Created by chunmato on 15/3/16.
 */

require('../common/commonDefs.js');

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
        console.log('New connection!');

        // TODO@chunmato
        socket.on(EventNetworkLED.Login, function (data) {
            console.log(data);
        });

        // TODO@chunmato
        socket.on(EventNetworkLED.StartGame, function (data){
            console.log(data);
        });

    });
}

exports.start = start;