require('./array');
var nativeHashing = require('./utils').nativeHashing;

function Set() {
    var pairs = Array.prototype.map.call(arguments, function (element) {
        return [element, true];
    });

    var hashCodeMap = nativeHashing(pairs);
    return function (key) {
        return !!nativeHashing.getKeyFrom(key, hashCodeMap);
    };
}

module.exports = Set;