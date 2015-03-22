/**
 * Created by chunmato on 15/3/17.
 */

require('../../common/commonDefs.js');
var game_manager = require('./game_manager.js');

module.exports = function Game(socket_handler){
    this.id = 0;
    this.runners = {};
    this.game_state = GAME_STATE.RESERVED;

    // Led socket handler
    this.socket_handler = socket_handler;

    this.reset = function() {
        this.id = 0;
        // Clear runners in game_manager
        for (var runner_id in this.runners){
            game_manager.runners[runner_id] = null;
        }
        this.runners = {};
        // Reset game state.
        this.game_state = GAME_STATE.RESERVED;
    }
}

