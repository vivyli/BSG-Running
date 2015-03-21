/**
 * Created by chunmato on 15/3/17.
 */

require('../../common/commonDefs.js');

module.exports = function Game(socket_handler){
    this.id = 0;
    this.runners = {};
    this.game_state = GAME_STATE.RESERVED;

    // Led socket handler
    this.socket_handler = socket_handler;

    this.reset = function()
    {
        this.id = 0;
        this.runners = {};
        this.game_state = GAME_STATE.RESERVED;
    }
}

