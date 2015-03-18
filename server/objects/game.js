/**
 * Created by chunmato on 15/3/17.
 */

var GAME_STATE = {
    RESERVED            :   0,
    WAITING_FOR_LED     :   1,
    WAITING_FOR_PLAYERS :   2,
    READY_TO_START      :   3,
    RUNNING             :   4,
    FINISHED            :   5

};

/*
var Game = {
    runners : [],
    game_state : GAME_STATE.RESERVED

};*/

module.exports = function Game(){
    this.id = 0;
    this.runners = {};
    this.game_state = GAME_STATE.RESERVED;

}

