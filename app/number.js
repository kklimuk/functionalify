var utils = require('./utils');

Object.defineProperties(Number.prototype, {
    "times": utils.makeProperty('get', function () {
        var result = [];

        for (var i = 0; i < this; i++) {
            result.push(i);
        }

        return result;
    }),

    "timestamp": utils.makeProperty('get', function () {
        return new Date(this);
    })
});