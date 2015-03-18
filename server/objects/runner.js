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

module.exports = function Runner(){
    this.current_speed = 0;
    this.dis_to_dest = GameDefinition.RunwayLength;
    this.current_speed = RUNNER_STATE.RESERVED;
    this.last_updated_time = 0;

    this.update_speed = function (speed)
    {
        this.current_speed = speed;
        this.last_updated_time = Date.parse(new Date());
    }
}

