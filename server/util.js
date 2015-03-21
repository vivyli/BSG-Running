/**
 * Created by chunmato on 15/3/18.
 */

var log = require('./log.js');
var querystring = require('querystring');
var config = require('./config.js');

function handlePostRequest(request, callback){
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
            // TEST
            var responseString = "";
             for (var i in object_post_data) {
                responseString += i + " => " + object_post_data[i];
             }

            if (__DEBUG__ == 1)
                log.log_with_color('[DEBUG]:' + responseString, 'green');

            // TEST
            callback(object_post_data);
        });
    }
}

function send_text_response(response, text){
    if (typeof(text) != 'string')
        return log.error_type_error('text', 'string', typeof(text));

    response.writeHead(200, {"Content-Type": "text/plain",
        "Access-Control-Allow-Origin": "*"});
    response.write(text);
    response.end();

    return true;
}

function average(arr)
{
    var len = arr.length;
    if (len == 0)
        return 0;

    var sum = 0;
    for (var i = 0; i < len; i ++)
    {
        sum = sum + arr[i];
    }

    return sum / len;
}

exports.handlePostRequest = handlePostRequest;
exports.send_text_response = send_text_response;
exports.average = average;