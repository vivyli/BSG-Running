/**
 * Created by chunmato on 15/3/16.
 */

var http = require('http');
//var querystring = require('querystring');

var uc_events = {};
uc_events.actions = {};

uc_events.route = function(request, response) {
    console.log('routing '+request.url);
    var uriComponents = request.url.split('/');
    console.log(uriComponents[1]);
    if (typeof uc_events.actions[uriComponents[1]] == 'function') {
        console.log('action '+uriComponents[1]+' found');
        request.connection.setTimeout(0);
        uc_events.actions[uriComponents[1]].apply(uc_events, [request, response]);
        return true;
    }

    return false;
};

// TODO@chunmato - need define the uc events.
uc_events.actions.hello = function(request, response) {
    console.log('hello in action.hello');
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write('HOHOHO');
    response.end();
}

//uc server
function start(port)
{
    console.log("uc server started with port " + port);
    http.createServer(function(request, response) {
        console.log('received request '+request.url);
        if (!uc_events.route(request, response)) {
            console.log('bad request');
            console.log(request.url);
           // response.writeHead(404);
           // response.end();
        }
    }).listen(port);
}

exports.start = start;