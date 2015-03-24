/**
 * Created by chunmato on 15/3/19.
 */

var Game = require('./game.js');
var config = require('../config.js');

module.exports = function GameManager() {
    this.games = {};
    this.runners = {};

    this.game_id_seed = 1;

    this.new_game_id = function() {
        if (__TEST__ == 1)
            return 1;
        else {
            var game_id = this.game_id_seed;
            this.game_id_seed = this.game_id_seed + 1;
            return game_id;
        }
    }

    this.new_game = function(socket_handler) {
        var ng_id = this.new_game_id();
        var ng = new Game(socket_handler);
        ng.id = ng_id;
        this.games[ng.id] = ng;

        return ng;
    };

    this.update_game = function (game) {
        if (game != null) {
            var ng_id = this.new_game_id();
            game.id = ng_id;
        }
    };

    this.get_game = function(game_id) {
        if (game_id != null && this.games[game_id] != null)
            return this.games[game_id];
        else
            return null;
    };

    this.get_game_by_user_id = function (user_id) {
        if (user_id == null)
            return null;

        var game_id = this.runners[user_id];
        if (game_id == null)
            return null;

        return this.get_game(game_id);
    };

    this.register_runner = function (user_id, game_id)
    {
        if (user_id == null || game_id == null)
            return false;
        if (this.runners[user_id] != undefined)
            return false;
        this.runners[user_id] = game_id;
        return true;
    };

    this.get_runner = function (user_id) {
        var game = get_game_by_user_id(user_id);
        var runner = null;
        if (game != null)
            runner = game.runners[user_id];

        return runner;
    }
};
