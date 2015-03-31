require('../common/commonDefs.js');
var http_server=require('node-http-server');

function start() {
    console.log('Web server started with port: ' + NETWORK_CONSTANTS.WEB_SERVER_PORT);

    http_server.deploy(
        {
            port:NETWORK_CONSTANTS.WEB_SERVER_PORT,
            root:'./'
        }
    );
}

exports.start = start;
