/**
 * Created by chunmato on 15/3/18.
 */

require("../design/running.js");
var Runner = require('./objects/runner.js');
var log = require('./log.js');
var colors = require('colors');

// Calculate runner's speed via shake_data
function calculateRunnerSpeed(shake_data)
{
    var data = Math.sqrt(shake_data);
    return Math.max(0, ((data - 1) / GameDefinition.ShakeData2SpeedFactor));
}

function get_runner(user_id)
{
    var game = game_manager.get_game_by_user_id(user_id);
    var runner = null;
    if (game != null)
        runner = game.runners[user_id];

    return runner;
}

function process(user_id, shake_data)
{
    if (__DEBUG__ == 1)
        log.log_with_color('[runner_processor:process]: user_id = ' + user_id + ', shake_data = ' + Math.sqrt(shake_data), 'yellow');
    var runner = get_runner(user_id);
    if (runner != null) {
        runner.update_speed(calculateRunnerSpeed(shake_data));
        return true;
    }

    return false;
}

function heart_beat(user_id)
{
    var runner = get_runner(user_id);
    if (runner == null)
        return false;

    runner.last_updated_time = Date.parse(new Date());
    runner.state = RUNNER_STATE.READY;
    console.log('[HB] user id = ' + user_id);

    return true;
}

function register_runner(user_id, game_id)
{
    if (__DEBUG__ == 1)
        log.log_with_color('[register_runner] user_id = ' + user_id + ' game_id = ' + game_id, 'blue');
    var game = game_manager.get_game(game_id);
    if (game == null)
    {
        log.log_with_color('[Error] No game instance!', Log_Config.error_color);
        return false;
    }

    if (get_runner(user_id, game) != null)
    {
        console.log('\'' + user_id + '\' is already registered');
        return false;
    }

    var ok = game_manager.register_runner(user_id, game_id);

    if (ok == false)
        log.log_with_color('[Error] Register user failed', 'red');
    log.log_with_color('[DEBUG] game id in register_runner is :' + game_manager.get_game_by_user_id(user_id).id, 'yellow')

    var runner = new Runner(user_id);
    game.runners[user_id] = runner;

    game.socket_handler.emit(EventNetworkLED.PrepareState, {user_id : user_id});
    // TEST
    console.log('[Player Login] user id: ' + user_id);

    return true;
}

exports.process = process;
exports.heart_beat = heart_beat;
exports.register_runner = register_runner;