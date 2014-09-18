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

function mapper (mapping, ignoreError) {
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
    };
}

Object.defineProperties(Object.prototype, {
    "isEmpty": functools.makeProperty('get', function () {
        return Object.keys(this).length === 0;
    }),

    "nonEmpty": functools.makeProperty('get', function () {
        return !this.isEmpty;
    }),

    "pairs": functools.makeProperty('get', function () {
        return this.keys.zip(this.values);
    }),

    "keys": functools.makeProperty('get', function () {
        return Object.keys(this);
    }),

    "values": functools.makeProperty('get', function () {
        var self = this;
        return Object.keys(this).map(function (key) {
            return self[key];
        });
    }),

    "contains": functools.makeProperty('value', function (value) {
        return value in this;
    }),

    "map": functools.makeProperty('value', mapper(functools.identity)),

    "foreach": functools.makeProperty('value', function () {
        mapper(functools.identity, true).apply(this, arguments);
    }),

    "flatMap": functools.makeProperty('value', mapper(function (value) {
        return functools.hasFlatMap(value) ? value.flatMap(functools.identity) : value;
    })),

    "filter": functools.makeProperty('value', function (func) {
        var result = {};
        for (var key in this) {
            if (this.hasOwnProperty(key) && func(this[key], key, this)) {
                result[key] = this[key];
            }
        }
        return result;
    })
});