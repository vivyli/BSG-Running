/**
 * Created by chunmato on 15/3/24.
 */

var fs = require('fs');
var http = require('http');

http.createServer(function(request, response) {
    console.log(request.url);
    if (request.url == '/test')
    {
        fs.readFile(__dirname + '/test.html',
            function (err, data) {
                if (err) {
                    response.writeHead(500);
                    return response.end('Error loading test.html');
                }

                response.writeHead(200);
                response.end(data);
            });
    }
}).listen(8888);