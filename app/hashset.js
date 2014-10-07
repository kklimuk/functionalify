require('./array');
var nativeHashing = require('./utils').nativeHashing,
    makeProperty = require('./utils').makeProperty;

function Set() {
    var hashCodeMap = nativeHashing(Array.prototype.map.call(arguments, function (element) {
        return [element, true];
    }));

    hashCodeMap.__elements__ = Array.from(arguments).reduce(function (acc, item) {
        if (acc.indexOf(item) === -1) {
            acc.push(item);
        }
        return acc;
    }, []);

    return wrapSetFunction.call(null, hashCodeMap, function (key) {
        return !!nativeHashing.getKeyFrom(key, hashCodeMap);
    });
}

function wrapSetFunction(hashCodeMap, func) {
    Object.defineProperties(func, {
        'size': { value: hashCodeMap.__elements__.length },

        '__elements__': { value: hashCodeMap.__elements__, enumerable: true },

        'map': makeProperty('value', function (func) {
            var result = [];
            for (var i = 0, length = hashCodeMap.__elements__.length; i < length; i++) {
                result.push(func(hashCodeMap.__elements__[i]));
            }
            return Set.apply(null, result);
        }),

        'flatMap': makeProperty('value', function () {
            var result = [];



            return Set.apply(null, result);
        }),

        'forEach': makeProperty('value', function (func) {
            for (var i = 0, length = hashCodeMap.__elements__.length; i < length; i++) {
                func(hashCodeMap.__elements__[i]);
            }
        }),

        'iterator': { value: hashCodeMap.__elements__ }
    });

    return func;
}

module.exports = Set;