var functools = require('./common');

function Try(func) {
    try {
        return Success(func())
    } catch (error) {
        return Failure(error);
    }
}

function Success(value) {
    var flatmap = function (func) {
        var val = func(value);
        return functools.hasFlatMap(val) ? val.flatMap(functools.identity) : Try(val);
    };

    return Object.create(Success.prototype, {
        "value": { value: value },
        "map": {
            value: function (func) {
                return Try(func(value));
            }
        },
        "flatMap": { value: flatmap }

    });
}

function Failure(error) {

}

module.exports = Try;