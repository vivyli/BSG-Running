/**
 * Created by chunmato on 15/3/18.
 */

require("../design/running.js");

// Calculate runner's speed via shake_data
function calculateRunnerSpeed(shake_data)
{
    return shake_data / GameDefinition.ShakeData2SpeedFactor;
}

// TODO@chunmato
function process(user_id, shake_data)
{
    var speed = calculateRunnerSpeed(shake_data);
    if (game_manager.game != null && game_manager.game.runners[user_id] != null) {
        game_manager.game.runners[user_id].update_speed(speed);

        console.log(game_manager.game.runners[user_id]);
    }

    return true;
}

exports.process = process;