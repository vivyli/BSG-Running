/**
 * Created by chunmato on 15/3/22.
 */

require('../common/commonDefs.js');
var log = require('log.js');

// Game State -> Opened event
// WAITING_FOR_PLAYER   ->  Player.Login, Player.HeartBeat
// READY_TO_START       ->  LED.StartGame, @TEMP Player.Sensor
// RUNNING              ->  Player.Sensor, LED.EndGame
// FINISHED             ->  LED.Login
function check_accept_event(game_state, event) {

    if (__TEST__ == 2)
        return true;

    if (game_state == null || game_state == undefined){
        if (event == EventNetworkLED.Login)
            return true;
        return false;
    }

    switch (game_state) {
        case GAME_STATE.RESERVED:
            if (event == EventNetworkLED.Login)
                return true;
            break;
        case GAME_STATE.WAITING_FOR_PLAYERS:
            if (event == EventNetworkPlayer.Login || event == EventNetworkPlayer.HeartBeat)
                return true;
            break;
        case GAME_STATE.READY_TO_START:
            if (event == EventNetworkLED.StartGame || event == EventNetworkPlayer.Sensor || event == EventNetworkPlayer.Login || event == EventNetworkPlayer.HeartBeat || event == EventNetworkLED.EndGame)
                return true;
            break;
        case GAME_STATE.RUNNING:
            if (event == EventNetworkPlayer.Sensor || event == EventNetworkPlayer.HeartBeat || event == EventNetworkLED.EndGame)
                return true;
            break;
        case GAME_STATE.FINISHED:
            if (event == EventNetworkLED.Login || event == EventNetworkPlayer.Sensor)
                return true;
            break;
    }

    log.log_with_color('[WORKFLOW-CONTROL] FAILED: state = ' + game_state + ' event = ' + event);
    return false;
}

exports.check_accept_event = check_accept_event;