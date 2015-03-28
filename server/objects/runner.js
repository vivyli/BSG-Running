/**
 * Created by chunmato on 15/3/17.
 */


require('../../common/commonDefs.js');
require('../../design/running.js');
var log = require('../log.js');
var util = require('../util.js');

RUNNER_STATE = {
    RESERVED    :   0,
    READY       :   1,
    RUNNING     :   2,
    FINISHED    :   3
};

module.exports = function Runner(user_id){
    this.id = user_id;
    this.speed_sum = 0;
    this.update_times = 0;
    this.dis_to_dest = GameDefinition.RunwayLength;
    this.state = RUNNER_STATE.RESERVED;
    this.last_updated_time = Date.parse(new Date());
    this.speed_buffer = new Array();

    this.update_speed = function (speed) {
        this.speed_sum = this.speed_sum + speed;
        this.update_times = this.update_times + 1;
        this.last_updated_time = Date.parse(new Date());
    };

    this.get_speed = function () {
        if (this.update_times == 0)
            return -1;
        else {
            return this.speed_sum / this.update_times;
        }
    };

    this.reset_speed = function() {
        this.speed_sum = 0;
        this.update_times = 0;
    };

    this.update_speed_buffer = function (speed) {
        if (this.speed_buffer.length >= GameDefinition.SpeedBufferSize) {
            this.speed_buffer.shift();
            this.speed_buffer.push(speed);
        }
        else {
            this.speed_buffer.push(speed);
        }
    };

    this.get_speed_from_speed_buffer = function () {
        /*var dup_speed_buffer = this.speed_buffer.slice();
        dup_speed_buffer.sort(function(a, b){
            if (a > b) return 1;
            else if (a < 0) return -1;
            else return 0;
        });
        var mid_idx = 0;

        var speed_buffer_size = this.speed_buffer.length;
        if (speed_buffer_size == 0)
            return 0;
        else if (speed_buffer_size % 2 == 0)
        {
            mid_idx = speed_buffer_size / 2 - 1;
        }
        else
        {
            mid_idx = (speed_buffer_size - 1) / 2;
        }

        log.log_with_color('mix_idx = ' + mid_idx + '  speed = ' + dup_speed_buffer[mid_idx], 'red');
        return dup_speed_buffer[mid_idx];
        */
        return util.average(this.speed_buffer);
    };

    this.is_alive = function () {
        var now_t = Date.parse(new Date());
        var cap = now_t - this.last_updated_time;
        if (cap >= 5000)
            return false;
        return true;
    };
};

