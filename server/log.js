/**
 * Created by chunmato on 15/3/19.
 */

var fs = require('fs');
var colors = require('colors');

function error_type_error(paramname, exp_type, cur_type)
{
    console.error('parameter \'' + paramname +'\' is invalid. The type should be \'' + exp_type +
    '\' rather than \'' + cur_type + '\'');
    return false;
}

function log_with_color(text, color)
{
    console.log(text[color]);
}

function log_to_file(filename, text)
{
    fs.open(filename, "wa", 0644, function(e, fd){
        if (e) throw  e;
        fs.write(filename, text, function(e){
            if (e) throw e;
            fs.close();
        });
    });
}

exports.error_type_error = error_type_error;
exports.log_to_file = log_to_file;
exports.log_with_color = log_with_color;