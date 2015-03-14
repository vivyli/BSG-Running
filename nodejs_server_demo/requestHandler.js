var redis = require("redis");

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
exports.start = start;
exports.run = run;
