/**
 * Created by chunmato on 15/3/18.
 */

var log = require('./log.js');
var querystring = require('querystring');
var config = require('./config.js');
var http = require('http');
var qrcode = require('qrcode-js');

function handlePostRequest(request, callback){
    var post_data = "";
    if (request.method == "POST") {
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

function average(arr) {
    var len = arr.length;
    if (len == 0)
        return 0;

    var sum = 0;
    for (var i = 0; i < len; i ++) {
        sum = sum + arr[i];
    }

    return sum / len;
}

function map_length(mp) {
    var cnt = 0;

    for (var k in mp) {
        cnt ++;
    }
    return cnt;
}

function encode_image(imgurl, callback) {
    //var imgurl = 'http://wx.qlogo.cn/mmopen/g3MonUZtNHkdmzicIlibx6iaFqAc56vxLSUfpb6n5WKSYVY0ChQKkiaJSgQ1dZuTOgvLLrhJbERQQ4eMsv84eavHiaiceqxibJxCfHe/96';
    var imgurl = 'http://localhost/tx.png';
    log.log_with_color('[----------- DEBUG -----------] Start Encoding!', 'blue');
    http.get(imgurl, function(res){
        var imgData = "";
        res.setEncoding("binary");
        res.on("data", function(chunk){
            imgData+=chunk;
        });
        res.on("end", function(){
            var base64 = new Buffer(imgData, 'binary').toString('base64');
            var data = "data:" + res.headers["content-type"] + ";base64," + base64;
            log.log_with_color('[----------- DEBUG -----------] End sending!', 'blue');
            callback(data);
            return data;
        });
    });
    return null;
}

function gen_qrcode_base64(url) {
    var data = "data:png;base64," + qrcode.toBase64(url, 6);
    return data;
}

function get_wx_qrcode_url(wxaccount) {
    var url = SERVER_HOST + '/v2/client-led/wxqrcode/' + wxaccount + '.png';
    return url;
}

exports.handlePostRequest = handlePostRequest;
exports.send_text_response = send_text_response;
exports.average = average;
exports.map_length = map_length;
exports.encode_image = encode_image;
exports.gen_qrcode_base64 = gen_qrcode_base64;
exports.get_wx_qrcode_url = get_wx_qrcode_url;