/**
 * Created by chunmato on 15/3/15.
 */

var app = require('http').createServer(handler);
var io = require('socket.io')(app);
var fs = require('fs');

app.listen(8888);

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

io.on('connection', function (socket) {
    console.log('New Connection');
    var idx = 1;
    setInterval(function(){
        socket.emit('news', { hello: 'world' });
        idx = idx + 1;
 //       if (idx == 10)
  //          socket.disconnect();
    }, 500);
   // socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
        console.log(data);
    });
    socket.on('disconnect', function(){
        io.emit('user disconneted!!');
        console.log('user disconnected');
    });
    socket.on('reconnect', function(){
        io.emit('user Reconnected!!');
        console.log('user Reconnect!!');

    });

});