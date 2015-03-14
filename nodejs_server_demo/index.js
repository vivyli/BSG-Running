
var server = require("./server");
var route = require("./route");
var requestHandler = require("./requestHandler");

var handler = {};
handler["/"] = requestHandler.start;
handler["/start"] = requestHandler.start;
handler["/run"] = requestHandler.run;

server.start(route.route, handler);

