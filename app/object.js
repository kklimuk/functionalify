var functools = require('./common');

Object.defineProperty(Object, "zip", {
    value: function (arrayOfPairs) {
        var result = {};

        for (var i = 0, length = arrayOfPairs.length; i < length; i++) {
            result[arrayOfPairs[i][0]] = arrayOfPairs[i][1];
        }

        return result;
    }
});

var mapper = function (mapping) {
    return function (func) {
        var result = {};

        for (var key in this) {
            if (this.hasOwnProperty(key)) {
                var value = func(this[key], key, this);
                if (Array.isArray(value) && value.length === 2) {
                    result[value[0]] = mapping(value[1]);
                } else {
                    throw "Invalid mapper error. Needed [key, value], got " + JSON.stringify(value) + ".";
                }
            }
        }

        return result;
    }
};

Object.defineProperties(Object.prototype, {
    "map": {
        value: mapper(functools.identity),
        writable: true
    },

    "foreach": {
        value: function () {
            mapper(functools.identity);
        }
    },

    "flatMap": {
        value: mapper(function (value) {
            return functools.hasFlatMap(value) ? value.flatMap(functools.identity) : value;
        }),
        writable: true
    },

    "filter": {
        value: function (func) {
            var result = {};
            for (var key in this) {
                if (this.hasOwnProperty(key) && func([key, this[key]])) {
                    result[key] = this[key];
                }
            }
            return result;
        },
        writable: true
    }
});