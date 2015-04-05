/**
 * Created by chunmato on 15/3/17.
 */

require('../../common/commonDefs.js');
require('../../design/running.js');
util = require('../util.js');

module.exports = function Game(socket_handler){
    this.id = 0;
    this.runners = {};
    this.game_state = GAME_STATE.RESERVED;

    this.user_id_seed = 1;

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
        this.user_id_seed = 1;
    }

    this.can_join = function(){
        var map_len = util.map_length(this.runners) + 1;
        console.log('[Can_Join] lengh = ' + map_len);
        if (map_len <= GameDefinition.HeadCountLimit)
            return true;
        else
            return false;
    }

    this.new_user_id = function() {
        var user_id = this.user_id_seed;
        this.user_id_seed ++;

        return user_id;
    }

    this.get_game_url = function () {
        var u = 'http://' + NETWORK_CONSTANTS.SERVER_HOST;
        if (NETWORK_CONSTANTS.WEB_SERVER_PORT != 80)
            u = u + ':' + NETWORK_CONSTANTS.WEB_SERVER_PORT;
        u = u + '/client-player/login?game_id=' + this.id;
        console.log(u);
        return u;
    }
}

