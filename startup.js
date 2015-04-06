/**
 * Created by chunmato on 15/4/1.
 */

var GameManager = require('./server/objects/game_manager.js');
var bsg_server = require('./server/bsg_server.js');
var bsg_web_server = require('./webserver/bsg_web_server.js');
var readline = require('readline');

game_manager = new GameManager();

function startup() {
    bsg_server.start();
   // bsg_web_server.start();

    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.prompt();

    rl.on('line', function(line) {
        switch (line.trim()) {
            case 'exit':
                process.exit(0);
                break;
        }

        rl.prompt();
    }).on('close', function(){
        console.log('Have a great day!');
        process.exit(0);
    });
}

startup();