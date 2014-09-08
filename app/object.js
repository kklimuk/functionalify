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

var mapper = function (mapping, ignoreError) {
    return function (func) {
        var result = {};

        for (var key in this) {
            if (this.hasOwnProperty(key)) {
                var value = func(this[key], key, this);
                if (Array.isArray(value) && value.length === 2) {
                    result[value[0]] = mapping(value[1]);
                } else if (!ignoreError) {
                    throw "Invalid mapper error. Needed [key, value], got " + JSON.stringify(value) + ".";
                }
            }
        }

        return result;
    }
};

Object.defineProperties(Object.prototype, {
    "isEmpty": {
        get: function () {
            for (var key in this) {
                if (this.hasOwnProperty(key)) {
                    return false;
                }
            }
            return true;
        }
    },

    "nonEmpty": {
        get: function () {
            return !this.isEmpty;
        }
    },

    "map": {
        value: mapper(functools.identity),
        writable: true
    },

    "foreach": {
        value: function () {
            mapper(functools.identity, true).apply(this, arguments);
        },
        writable: true
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
                if (this.hasOwnProperty(key) && func(this[key], key, this)) {
                    result[key] = this[key];
                }
            }
            return result;
        },
        writable: true
    }
});