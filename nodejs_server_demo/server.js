/**
 * Created by chunmato on 15/3/15.
 */

var http = require("http");
var url = require("url");


function start(route, handle)
{
    function onRequest(request, response)
    {
        var pathname = url.parse(request.url).pathname;
        console.log("Request for " + pathname + " is received!");


        route(handle, pathname, response);
    }

    http.createServer(onRequest).listen(8888);
    console.log("Server Started!");
}

exports.start = start;
