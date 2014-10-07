var Maybe = require('./maybe'),
    functools = require('./common'),
    nativeHashing = require('./utils').nativeHashing;

require('./array');

function Map() {
    var keys = [];
    var pairs = Array.prototype.reduce.call(arguments, function (acc, pair) {
        if (!Array.isArray(pair) && typeof pair === 'object') {
            var unzipped = Object.unzip(pair);
            keys.push.apply(keys, unzipped.map(function (pair) {
                return pair[0];
            }));
            acc.push.apply(acc, unzipped);
        } else {
            functools.assert(Array.isArray(pair), "The input is neither an array or object");
            functools.assert(pair.length, "The input pair array must have a length of 2");

            if (keys.indexOf(pair[0]) === -1) {
                keys.push(pair[0]);
                acc.push(pair);
            }
        }

        return acc;
    }, []);

    var hashCodeMap = nativeHashing(pairs);
    hashCodeMap.__elements__ = pairs;
    return wrapApplyFunctionMap.call(null, hashCodeMap, function (key) {
        return nativeHashing.getKeyFrom(key, hashCodeMap);
    });
}

function wrapApplyFunctionMap(hashCodeMap, func) {
    Object.defineProperties(func, {
        "add": {
            value: function (pair) {
                return Map.apply(null, hashCodeMap.__elements__.immutableAppend(pair));
            }
        },

        "__elements__": { value: hashCodeMap.__elements__, enumerable: true },

        "getMaybe": {
            value: function (key) {
                return Maybe(func(key));
            }
        },

        "size": {
            value: hashCodeMap.__elements__.length
        },

        "iterator": { value: hashCodeMap.__elements__ }
    });

    return func;
}

module.exports = Map;
