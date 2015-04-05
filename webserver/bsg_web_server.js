require('../common/commonDefs.js');
var http_server=require('node-http-server');
var request_handler = require('./request_handler.js');


function start() {
    console.log('Web server started with port: ' + NETWORK_CONSTANTS.WEB_SERVER_PORT);

    http_server.deploy(
        {
            port:NETWORK_CONSTANTS.WEB_SERVER_PORT,
            root:'./',
            reqs: ['/client-player/pl_login'],
            callback: request_handler.request_handler
        }
    );
}

exports.start = start;
