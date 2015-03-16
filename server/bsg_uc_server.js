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
        uc_events.actions[uriComponents[1]].apply(uc_events, [request, response, uriComponents[2]]);
        return true;
    }

    return false;
};

// TODO@chunmato - need define the uc events.
uc_events.actions.hello = function(request, response, module) {
    console.log('hello '+module);
}

//uc server
function start(port)
{
    console.log("uc server started with port " + port);
    http.createServer(function(request, response) {
        console.log('received request '+request.url);
        if (!uc_events.route(request, response)) {
            console.log('bad request');
            response.writeHead(404);
            response.end();
        }
    }).listen(port);
}

exports.start = start;