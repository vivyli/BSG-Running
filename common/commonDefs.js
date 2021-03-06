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
    UnPrepareState: "SC_un_prepare_state",
    WXqrcode: "SC_WX_qrcode", // led send wx qrcode id to server
    WXqrcodeResult: "SC_WX_qrcode_result", // server send wx qrcode server

    Interval : 500
};

EventNetworkPlayer = {
    Sensor : "PL_sensor", // player send sensor data to server
    HeartBeat : "PL_heart_beat", // player send heart beat to server
    Login: "PL_login"
};

NETWORK_CONSTANTS = {
    SERVER_HOST : "http://120.26.48.137",
    //SERVER_HOST : "http://192.168.10.105",
    LOCAL_HOST: "http://192.168.10.108",
    SERVER_PORT : 8888,
    WEB_SERVER_PORT: 80,
    SHAKE_DATA : "data",
    USER_ID : "user_id",
    GAME_ID : "game_id",
    USER_NAME : "user_name",
    USER_PHOTO : "user_photo",
    USER_GENDER : "user_gender",
    USER_ROLE : "user_role",
    QRCODE_DATA : "qrcode_data",

    IMAGE_SIZE : 96,
    QRCODE_SIZE : 430
};

GAME_STATE = {
    RESERVED            :   0,
    WAITING_FOR_LED     :   1,
    WAITING_FOR_PLAYERS :   2,
    READY_TO_START      :   3,
    RUNNING             :   4,
    FINISHED            :   5

};

DEVICE_TYPE = {
    RESERVED    :   0,
    IPHONE      :   1,
    ANDROID     :   2

};
