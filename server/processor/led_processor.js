/**
 * Created by chunmato on 15/3/19.
 */

require('../../common/commonDefs.js');

var config = require('../config.js');
var log = require('../log.js');

// Runner speed algorithm.
// The current algorithm it to calculate the average value of the latest updated speed.
function get_and_update_speed_buffer(runner){
    if (runner == null) return 0;

    var current_speed = runner.get_speed();
    runner.reset_speed();   // Every call this function MUST reset the runner's speed. Or the speed will be incorrect!
    if (current_speed == -1) {
        current_speed = runner.get_speed_from_speed_buffer();
        runner.update_speed_buffer(0);
    }
    else {
        runner.update_speed_buffer(current_speed);
        current_speed = runner.get_speed_from_speed_buffer();
    }

    return current_speed;
}

// Send all runners' status to LED client. Inc. user_id, current_speed
function process(game_id) {
    var game = game_manager.get_game(game_id);

    if (game == null) return false;
    if (game.game_state != GAME_STATE.READY_TO_START && game.game_state != GAME_STATE.RUNNING)
        return false;

    var debug_str = "";
    var runners_status = {};
    for (var runner_id in game.runners) {
        var runner = game.runners[runner_id];
        if (runner == null)
            continue;

        var current_speed = get_and_update_speed_buffer(runner);
        runners_status[runner_id] = current_speed;
        debug_str += runner_id + ': ' + current_speed;
    }
    game.socket_handler.emit(EventNetworkLED.GameState, runners_status);

    if (__DEBUG__ == 1)
        log.log_with_color('[SPEED]: ' + debug_str, Log_Config.sc_log_default_color);
}

function check_runners_alive(game_id){
    // TODO
    var game = game_manager.get_game(game_id);

    if (game == null) return false;
    if (game.game_state != GAME_STATE.READY_TO_START)
        return false;

    var dead_runners = [];
    var idx = 0;
    for (var runner_id in game.runners) {
        var runner = game.runners[runner_id];
        if (runner == null)
            continue;

        if (runner.is_alive() == false)
        {
            log.log_with_color('[DEAD1] user_id = ' + runner_id, Log_Config.error_color);
            dead_runners[idx] = runner_id;
            idx ++;
            //game_manager.runners[runner_id] = null;
            //game.runners[runner_id] == null;

        }

    }

    for (var i = 0; i < dead_runners.length; i ++) {
        log.log_with_color('[DEAD2] user_id = ' + dead_runners[i], Log_Config.error_color);
        delete game_manager.runners[dead_runners[i]];
        delete game.runners[dead_runners[i]];
        game.socket_handler.emit(EventNetworkLED.UnPrepareState, {user_id: dead_runners[i]});
    }

}

function update_rank (game, ranks) {
    if (game == null) return false;
    for (var i = 0; i < ranks.length; ++ i) {
        var runner_id = ranks[i];
        var runner = game.runners[runner_id];
        if (runner) {
            log.log_with_color('[Rank] runner_id = ' + runner_id + ' rank = ' + (i + 1), 'red');
            runner.rank = i + 1;
        }

    }
}

exports.process = process;
exports.check_runners_alive = check_runners_alive;
exports.update_rank = update_rank;