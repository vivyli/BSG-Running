/**
 * Created by chunmato on 15/3/17.
 */


require('../../common/commonDefs.js');

RUNNER_STATE = {
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

module.exports = function Runner(user_id){
    this.id = user_id;
    this.speed_sum = 0;
    this.update_times = 0;
    this.dis_to_dest = GameDefinition.RunwayLength;
    this.state = RUNNER_STATE.RESERVED;
    this.last_updated_time = Date.parse(new Date());

    this.update_speed = function (speed)
    {
        this.speed_sum = this.speed_sum + speed;
        this.update_times = this.update_times + 1;
        this.last_updated_time = Date.parse(new Date());
    }

    this.get_and_reset_speed = function () {
        if (this.update_times == 0)
            return 0;
        else
        {
            var speed = this.speed_sum / this.update_times;
            this.speed_sum = 0;
            this.update_times = 0;
            return speed;
        }
    }
}

