/**
 * Created by chunmato on 15/3/19.
 */

function process()
{
    var game = game_manager.game;
    if (game == null) return false;

    var runners_status = {};
    for (var runner in game.runners)
    {
        var runner_id = runner.id;
        var current_speed = runner.current_speed;

        runners_status[runner_id] = current_speed;
        game.socket_handler.emit(EventNetworkLED.GameState, runners_status);
    }
}

exports.process = process;