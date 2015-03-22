/**
 * Created by chunmato on 15/3/22.
 */

require('../common/commonDefs.js');

// Game State -> Opened event
// WAITING_FOR_PLAYER   ->  Player.Login, Player.HeartBeat
// READY_TO_START       ->  LED.StartGame, @TEMP Player.Sensor
// RUNNING              ->  Player.Sensor, LED.EndGame
// FINISHED             ->  LED.Login
function check_accept_event(game_state, event) {

    if (game_state == null || game_state == undefined){
        if (event == EventNetworkLED.Login)
            return true;
        return false;
    }

    switch (game_state) {
        case GAME_STATE.WAITING_FOR_PLAYERS:
            if (event == EventNetworkPlayer.Login || event == EventNetworkPlayer.HeartBeat)
                return true;
            break;
        case GAME_STATE.READY_TO_START:
            if (event == EventNetworkLED.StartGame || event == EventNetworkPlayer.Sensor)
                return true;
            break;
        case GAME_STATE.RUNNING:
            if (event == EventNetworkPlayer.Sensor)
                return true;
            break;
        case GAME_STATE.FINISHED:
            if (event == EventNetworkLED.Login)
                return true;
            break;
    }

    return false;
}

exports.check_accept_event = check_accept_event;