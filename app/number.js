var property = require('./utils').makeProperty;

Object.defineProperties(Number.prototype, {
    "times": property('value', function () {
        var result = [];

        for (var i = 0; i < this; i++) {
            result.push(i);
        }

        return result;
    })
});