/**
 * Created by slamzhzm on 2015/3/16.
 */

EventNetworkLED = {
    Login : "SC_login", // led send login to server
    GameID : "SC_gameid", // server send game id to led
    PrepareState : "SC_prepare_state", // server send player register to led
    StartGame : "SC_start_game", // led send game start to server
    GameState : "SC_game_state", // server send player speed to led
    EndGame : "SC_end_game" // led send game over to server
}

EventNetworkLED = {
    Sensor : "PL_sensor" // player send sensor data to server
}

NETWORK_CONSTANTS = {
    SERVER_HOST : "http://192.168.10.107:7777"
}
