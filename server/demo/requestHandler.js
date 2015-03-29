/**
 * Created by chunmato on 15/3/15.
 */

var http = require('http');
var fs = require('fs');

function start(response)
{
    var redis_client = redis.createClient();
    redis_client.rpush('aa', 'v');
    console.log("Request handler 'start' received");
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write("Hello, world");
    response.end();
    return "Hello, World";
}

function run(response)
{
    var redis_client = redis.createClient();
    response.writeHead(200, {"Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive"});

    setInterval(function(){
        redis_client.lpop('aa', function(err, reply){
            if (reply != null)
                response.write("data: " + reply + "\n\n");
        });
    }, 1000);


}

function readimg(response){
    var imgurl = 'http://wx.qlogo.cn/mmopen/g3MonUZtNHkdmzicIlibx6iaFqAc56vxLSUfpb6n5WKSYVY0ChQKkiaJSgQ1dZuTOgvLLrhJbERQQ4eMsv84eavHiaiceqxibJxCfHe/96';
    http.get(imgurl, function(res){
        var imgData = "";

        res.setEncoding("binary"); //一定要设置response的编码为binary否则会下载下来的图片打不开


        res.on("data", function(chunk){
            imgData+=chunk;
        });


        res.on("end", function(){
            var base64 = new Buffer(imgData, 'binary').toString('base64');
            var data = "data:" + res.headers["content-type"] + ";base64," + base64;

            console.log(data);
            fs.writeFile("./img/test.png", imgData, "binary", function(err){
                if(err){
                    console.log("down fail");
                }
                console.log("down success");
            });
        });
    });
}


var imageServer = function(http, url) {
    var _url = url;
    var _http = http;

    this.http = function(url, callback, method) {
        method = method || 'GET';
        callback = callback ||
        function() {};
        var urlData = _url.parse(url);
        var request = _http.createClient(80, urlData.host).
            request(method, urlData.pathname, {
                "host": urlData.host
            });

        request.end();

        request.on('response', function(response) {
            var type = response.headers["content-type"],
                body = "";
            response.setEncoding('binary');
            response.on('end', function() {
                var data = {
                    type: type,
                    body: body
                };
                callback(data);

            });
            response.on('data', function(chunk) {
                if (response.statusCode == 200) body += chunk;
            });
        });

    };
};


exports.start = start;
exports.run = run;
exports.readimg = readimg;