/**
 * Created by chunmato on 15/4/6.
 */

var mu = require('mu2');
var  url = require('url');
var util = require('util');
var web_config = require('./web_config.js');

/*
function serveText (text, response, config) {
    var headers = {
        'Content-Type' : config.contentType['html']
    }

    if(config.server.noCache)
        headers['Cache-Control']='no-cache, no-store, must-revalidate';

    serve(
        response,
        text,
        200,
        headers,
        'binary'
    );

    return;
}

function serve(response,body,status,headers,encoding){
    //defaults to 200
    if(!status)
        status=200;

    //defaults to text/plain
    if(!headers){
        headers={
            'Content-type':'text/plain'
        }
    }

    //defaults to utf8
    if(!encoding)
        encoding='utf8';

    response.writeHead(
        status,
        headers
    );
    response.write(body,encoding);
    response.end();
    return;
}
*/
function request_handler(request, response, config) {
    var uri = url.parse(request.url, true);
    var game_id = uri.query.game_id;
    mu.root = __dirname + Template_Config.client_template;
    var stream = mu.compileAndRender('login.html', {game_id: game_id});
    util.pump(stream, response);
}

exports.request_handler = request_handler;