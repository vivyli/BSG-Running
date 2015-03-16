/**
 * Created by chunmato on 15/3/16.
 */

require('../common/commonDefs.js'); // Load common event name definition.

var uc_server = require('./bsg_uc_server');
var sc_server = require('./bsg_sc_server');

var uc_port = 7777;
var sc_port = 9999;

uc_server.start(uc_port);
sc_server.start(sc_port);