/**
 * Created by chunmato on 15/3/19.
 */

function error_type_error(paramname, exp_type, cur_type)
{
    console.error('parameter \'' + paramname +'\' is invalid. The type should be \'' + exp_type +
    '\' rather than \'' + cur_type + '\'');
    return false;
}

exports.error_type_error = error_type_error;