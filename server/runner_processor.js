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
    var game = game_manager.game;
    var runner = null;
    if (game != null)
        runner = game.runners[user_id];

    return runner;
}

function process(user_id, shake_data)
{
    console.log(('[runner_processor:process]: user_id = ' + user_id + ', shake_data = ' + Math.sqrt(shake_data)).yellow);
    //log.log_to_file('./sample_data/shake_data.log', shake_data + '\n');
    var runner = get_runner(user_id);
    if (runner != null) {
        runner.update_speed(calculateRunnerSpeed(shake_data));
        //console.log(runner);
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

function register_runner(user_id)
{
    if (get_runner(user_id) != null)
    {
        console.log('\'' + user_id + '\' is already registered');
        return false;
    }

    var game = game_manager.game;
    if (game == null)
        return false;

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