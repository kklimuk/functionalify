var functools = require('./common');

Object.defineProperties(Number.prototype, {
    "times": functools.makeProperty('get', function () {
        var result = [];

        for (var i = 0; i < this; i++) {
            result.push(i);
        }

        return result;
    })
});