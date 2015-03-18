/**
 * Created by chunmato on 15/3/16.
 */

require('../common/commonDefs.js');
require('./util.js');

var http = require('http');
var url = require("url");
var querystring = require('querystring');
var runner_processor = require('./runner_processor');

var uc_events = {};
uc_events.actions = {};

uc_events.route = function(request, response) {
    var action = url.parse(request.url).pathname.split('/')[1];
    console.log('action received: ' + action);
    if (typeof uc_events.actions[action] == 'function') {
        request.connection.setTimeout(0);   // ?
        uc_events.actions[action].apply(uc_events, [request, response]);
        return true;
    }

    return false;
};

// PL_sensor event - UC will post data with user info and shake info
uc_events.actions[EventNetworkLED.Sensor] = function(request, response) {
    var post_data = "";
    if (request.method == "POST")
    {
        request.setEncoding("utf-8");
        // collect all POST data chunk
        request.addListener("data", function (post_data_chunk) {
            post_data += post_data_chunk;
        });

        // deal with POST data
        request.addListener("end", function () {
            var object_post_data = querystring.parse(post_data);

            var shake_data = object_post_data[NETWORK_CONSTANTS.SHAKE_DATA];
            var user_id = object_post_data[NETWORK_CONSTANTS.USER_ID];
            // TODO@chunmato - Should check parameters state
            runner_processor.process(user_id, shake_data);
            // @DEBUG
            var responseString = "";
            for (var i in object_post_data) {
                responseString += i + " => " + object_post_data[i];
            }
            console.log(responseString);
            response.writeHead(200, {"Content-Type": "text/plain",
                "Access-Control-Allow-Origin": "*"});
            response.write("Hello, Post");
            response.end();
            // @END DEBUG
        });
    }
    else if (request.method == "GET")
    {
        // TEST
        runner_processor.process(111, 11);
        response.writeHead(200, {"Content-Type": "text/plain",
            "Access-Control-Allow-Origin": "*"});
        response.write("Invalid request, please use POST method!");
        response.end();
    }

}

uc_events.actions[EventNetworkLED.HeartBeat] = function(request, response) {
    var post_data = "";
    if (request.method == "POST")
    {
        request.setEncoding("utf-8");
        // collect all POST data chunk
        request.addListener("data", function (post_data_chunk) {
            post_data += post_data_chunk;
        });

        // deal with POST data
        request.addListener("end", function () {
            var object_post_data = querystring.parse(post_data);

            var shake_data = object_post_data[NETWORK_CONSTANTS.SHAKE_DATA];
            var user_id = object_post_data[NETWORK_CONSTANTS.USER_ID];
            // TODO@chunmato - Should check parameters state
            runner_processor.process(user_id, shake_data);
            // @DEBUG
            var responseString = "";
            for (var i in object_post_data) {
                responseString += i + " => " + object_post_data[i];
            }
            console.log(responseString);
            response.writeHead(200, {"Content-Type": "text/plain",
                "Access-Control-Allow-Origin": "*"});
            response.write("Hello, Post");
            response.end();
            // @END DEBUG
        });
    }
    else if (request.method == "GET")
    {
        // TEST
        runner_processor.process(111, 11);
        response.writeHead(200, {"Content-Type": "text/plain",
            "Access-Control-Allow-Origin": "*"});
        response.write("Invalid request, please use POST method!");
        response.end();
    }

}

//uc server
function start(port)
{
    console.log("uc server started with port " + port);
    http.createServer(function(request, response) {
        if (!uc_events.route(request, response)) {
            console.log('bad request');
            response.writeHead(404);
            response.end();
        }
    }).listen(port);
}

exports.start = start;