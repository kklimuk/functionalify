var Maybe = require('./maybe'),
    functools = require('./common');
require('./array');

/* 
 Credit for the type retrieval function and regex
 goes to StackOverflow user Jason Bunting
 http://stackoverflow.com/questions/332422/how-do-i-get-the-name-of-an-objects-type-in-javascript
 */

var funcNameRegex = /function (.{1,})\(/;
function getType(obj) {
    return (obj).constructor.toString().match(funcNameRegex).last.getOrElse("");
}

/*
 Credit for the hashing function goes to StackOverflow
 users Jesse Shieh and esmiralha
 http://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript-jquery
 */

function hashCode(key) {
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

function Map() {
    var pairs = Array.prototype.reduce.call(arguments, function (acc, pair) {
        if (!Array.isArray(pair) && typeof pair === 'object') {
            acc.push.call(acc, Object.unzip(pair));
        } else {
            functools.assert(Array.isArray(pair), "The input is neither an array or object");
            functools.assert(pair.length, "The input pair array must have a length of 2");
            acc.push(pair);
        }

        return acc;
    }, []);

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
            hash = hashCode(key);
        }

        hashCodeMap[hash] = pairs[i][1];
    }

    return wrapApplyFunctionMap.call(null, pairs, function (key) {
        key = key.valueOf();

        var value;
        if (typeof key === "object" || typeof key === 'function') {
            value = hashCodeMap[key.__hashCode__];
        } else {
            value = hashCodeMap[hashCode(key)];
        }

        if (typeof value === 'undefined') {
            throw new ReferenceError("No such key in map.");
        }
        return value;
    });
}

function wrapApplyFunctionMap(pairs, func) {
    Object.defineProperties(func, {
        "add": {
            value: function (pair) {
                return Map.apply(null, pairs.append(pair));
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
