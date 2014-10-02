var Maybe = require('./maybe'),
    functools = require('./common'),
    nativeHashing = require('./utils').nativeHashing;

require('./array');

function Map() {
    var pairs = Array.prototype.reduce.call(arguments, function (acc, pair) {
        if (!Array.isArray(pair) && typeof pair === 'object') {
            acc.push.apply(acc, Object.unzip(pair));
        } else {
            functools.assert(Array.isArray(pair), "The input is neither an array or object");
            functools.assert(pair.length, "The input pair array must have a length of 2");
            acc.push(pair);
        }

        return acc;
    }, []);

    var hashCodeMap = nativeHashing(pairs);
    return wrapApplyFunctionMap.call(null, pairs, function (key) {
        return nativeHashing.getKeyFrom(key, hashCodeMap);
    });
}

function wrapApplyFunctionMap(pairs, func) {
    Object.defineProperties(func, {
        "add": {
            value: function (pair) {
                return Map.apply(null, pairs.immutableAppend(pair));
            }
        },

        "getMaybe": {
            value: function (key) {
                try {
                    return Maybe(func(key));
                } catch (error) {
                    return Maybe.None();
                }
            }
        },

        "size": {
            value: pairs.length
        }
    });
    return func;
}

module.exports = Map;
