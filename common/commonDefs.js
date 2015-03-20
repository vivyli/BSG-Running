/**
 * Created by slamzhzm on 2015/3/16.
 */

EventNetworkLED = {
    Login : "SC_login", // led send login to server
    GameID : "SC_gameid", // server send game id to led
    PrepareState : "SC_prepare_state", // server send player register to led
    StartGame : "SC_start_game", // led send game start to server
    GameState : "SC_game_state", // server send player speed to led
    EndGame : "SC_end_game", // led send game over to server

    Interval : 500
}

EventNetworkPlayer = {
    Sensor : "PL_sensor", // player send sensor data to server
    HeartBeat : "PL_heart_beat", // player send heart beat to server
    Login: "PL_login"
}

NETWORK_CONSTANTS = {
    SERVER_HOST_LED : "http://192.168.10.108:9999",
    SERVER_HOST_PL : "http://192.168.10.108:7777",

    SHAKE_DATA : "data",
    USER_ID : "user_id",
    GAME_ID : "game_id"
}

GAME_STATE = {
    RESERVED            :   0,
    WAITING_FOR_LED     :   1,
    WAITING_FOR_PLAYERS :   2,
    READY_TO_START      :   3,
    RUNNING             :   4,
    FINISHED            :   5

}