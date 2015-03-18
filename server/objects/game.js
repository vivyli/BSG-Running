/**
 * Created by chunmato on 15/3/17.
 */

require('../common/commonDefs.js');

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

