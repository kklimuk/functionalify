var functools = require('./common');

function Maybe(value) {
    return Some(value);
}
Maybe.Some = Some;
Maybe.None = None;

function Some(value) {
    if (typeof value === 'undefined' || value === null) {
        return None();
    }

    var flatmap = function (func) {
        var val = func(value);
        return functools.hasFlatMap(val) ? val.flatMap(functools.identity) : Maybe(val);
    };

    return Object.create(Some.prototype, {
        "value": { value: value, enumerable: true },
        "map": {
            value: function (func) {
                return Maybe(func(value));
            }
        },
        "flatMap": { value: flatmap },
        "filter": {
            value: function (func) {
                return func(value) ? this : None();
            }
        },
        "getOrElse": {
            value: function () {
                return value;
            }
        }
    });
}

var self = function () {
    return this;
};
var none = Object.create(None.prototype, {
    map: { value: self },
    flatMap: { value: self },
    filter: { value: self },
    getOrElse: {
        value: function (orElse) {
            return orElse;
        }
    }
});

function None() {
    return none;
}

module.exports = Maybe;