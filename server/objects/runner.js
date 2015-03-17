/**
 * Created by chunmato on 15/3/17.
 */


require('../../common/commonDefs.js');

var RUNNER_STATE = {
    RESERVED    :   0,
    READY       :   1,
    RUNNING     :   2,
    FINISHED    :   3
};

/*
var Runner = {
    current_speed   :   0,
    dis_to_dest     :   0,
    runner_state    :   0
};*/

function Runner(){
    this.current_speed = 0;
    this.dis_to_dest = GameDefinition.RunwayLength;
    this.current_speed = RUNNER_STATE.RESERVED;
}

