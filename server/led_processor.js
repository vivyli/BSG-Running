/**
 * Created by chunmato on 15/3/19.
 */

function process()
{
    var game = game_manager.game;
    if (game == null) return false;

    var debug_str = "";
    var runners_status = {};
    for (var runner_id in game.runners)
    {
        var current_speed = game.runners[runner_id].get_and_reset_speed();

        runners_status[runner_id] = current_speed;
        debug_str += runner_id + ': ' + current_speed;
    }
    game.socket_handler.emit(EventNetworkLED.GameState, runners_status);
    
    //console.log('[SPEED]: ' + debug_str);
}

exports.process = process;