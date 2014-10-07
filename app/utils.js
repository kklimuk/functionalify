require('./array');
var tools = require('./common');

/*
 Credit for the type retrieval function and regex
 goes to StackOverflow user Jason Bunting
 http://stackoverflow.com/questions/332422/how-do-i-get-the-name-of-an-objects-type-in-javascript
 */
var funcNameRegex = /function (.{1,})\(/;
function getType(obj) {
    return (obj).constructor.toString().match(funcNameRegex).last;
}

/*
 Credit for the hashing function goes to StackOverflow
 users Jesse Shieh and esmiralha
 http://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript-jquery
 */
function primitiveUniqueId(key) {
    var string = JSON.stringify(key) + getType(key);

    var hash = 0, i, chr, len;
    if (string.length === 0) {
        return string;
    }

    for (i = 0, len = string.length; i < len; i++) {
        chr = string.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0;
    }

    return hash.toString();
}

function nativeHashing(pairs) {
    var hashCodeMap = {};

    function randomize() {
        var hash = Math.round(Math.random() * 1e12);
        if (hash in hashCodeMap) {
            return randomize();
        }

        return hash.toString();
    }

    for (var i = 0, length = pairs.length; i < length; i++) {
        var key = pairs[i][0].valueOf(),
            hash = null;

        if (typeof key.__hashCode__ !== 'undefined') {
            hash = key.__hashCode__;
        } else if (typeof key === "object" || typeof key === 'function') {
            hash = randomize();
            Object.defineProperty(key, "__hashCode__", {
                value: hash
            });
        } else {
            hash = primitiveUniqueId(key);
        }

        hashCodeMap[hash] = pairs[i][1];
    }

    return hashCodeMap;
}

nativeHashing.getKeyFrom = function (key, from) {
    key = key.valueOf();

    if (typeof key === "object" || typeof key === 'function') {
        return from[key.__hashCode__];
    }

    return from[primitiveUniqueId(key)];
};

function hasFlatMap(val) {
    return (typeof val === "object" || typeof val === "function") && typeof val.flatMap === "function";
}

module.exports = {
    hasFlatMap: hasFlatMap,

    commonFlatMap: function (elements, func) {
        var result = [];

        for (var i = 0, length = elements.length; i < length; i++) {
            var element = elements[i];

            if (hasFlatMap(elements[i])) {
                if (tools.exists(element.__elements__)) {
                    result.push.apply(result, element.__elements__.flatMap(func));
                    continue;
                }

                if (element.__elements__ === null) {
                    continue;
                }

                var mapped = element.flatMap(func);
                if (mapped.length) {
                    result.push.apply(result, mapped);
                } else {
                    result.push(mapped);
                }
            } else {
                result.push(func(element));
            }
        }

        return result;
    },

    makeProperty: function (type, func) {
        if (type === 'get') {
            return {
                get: func,
                enumerable: false
            };
        }

        return {
            writable: true,
            value: func,
            enumerable: false
        };
    },

    primitiveUniqueId: primitiveUniqueId,
    nativeHashing: nativeHashing
};