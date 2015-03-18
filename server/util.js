/**
 * Created by chunmato on 15/3/18.
 */

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
}