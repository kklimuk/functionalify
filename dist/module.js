(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var functools = require('./common');
var Maybe = require('./maybe');

Object.defineProperties(Array, {
    "isArray": { // credit: Douglas Crockford
        value: function (value) {
            return value && typeof value === 'object' &&
                typeof value.length === 'number' &&
                typeof value.splice === 'function' && !(value.propertyIsEnumerable('length'));
        }
    },

    "from": {
        value: function (value, mapper, thisArg) {
            var array = Array.prototype.slice.call(value);
            if (typeof mapper !== 'undefined') {
                return array.map(mapper, thisArg);
            }

            return array;
        }
    }
});

Object.defineProperties(Array.prototype, {
    "isEmpty": functools.makeProperty('get', function () {
        return this.length === 0;
    }),

    "nonEmpty": functools.makeProperty('get', function () {
        return !this.isEmpty;
    }),

    "flatMap": functools.makeProperty('value', function (func) {
        return this.map(func).flatten();
    }),

    "flatten": functools.makeProperty('value', function () {
        var result = [];

        for (var i = 0, length = this.length; i < length; i++) {
            if (functools.hasFlatMap(this[i])) {
                result.push.apply(result, this[i].flatMap(functools.identity));
            } else {
                result.push(this[i]);
            }
        }

        return result;
    }),

    "head": functools.makeProperty('get', function () {
        return Maybe(this[0]);
    }),

    "last": functools.makeProperty('get', function () {
        return this.length === 0 ? Maybe.None() : Maybe(this[this.length - 1]);
    }),

    "init": functools.makeProperty('get', function () {
        return this.length === 0 ? [] : this.slice(0, this.length - 1);
    }),

    "tail": functools.makeProperty('get', function () {
        return this.length === 0 ? [] : this.slice(1);
    }),

    "take": functools.makeProperty('value', function (num) {
        return this.slice(0, num);
    }),

    "drop": functools.makeProperty('value', function (num) {
        return this.slice(num);
    }),

    "partition": functools.makeProperty('value', function (func) {
        var a = [], b = [];
        for (var i = 0, length = this.length; i < length; i++) {
            var pushTo = func(this[i]) ? a : b;
            pushTo.push(this[i]);
        }
        return [a, b];
    }),

    "takeWhile": functools.makeProperty('value', function (func) {
        for (var i = 0, length = this.length; i < length; i++) {
            if (!func(this[i])) {
                return this.slice(0, i);
            }
        }
        return this.slice(0);
    }),

    "dropWhile": functools.makeProperty('value', function (func) {
        for (var i = 0, length = this.length; i < length; i++) {
            if (!func(this[i])) {
                return this.slice(i);
            }
        }
        return [];
    }),

    "every": functools.makeProperty('value', function (func) {
        for (var i = 0, length = this.length; i < length; i++) {
            if (!func(this[i])) {
                return false;
            }
        }
        return true;
    }),

    "any": functools.makeProperty('value', function (func) {
        for (var i = 0, length = this.length; i < length; i++) {
            if (func(this[i])) {
                return true;
            }
        }

        return false;
    }),

    "find": functools.makeProperty('value', function (func) {
        for (var i = 0, length = this.length; i < length; i++) {
            if (func(this[i])) {
                return Maybe(this[i]);
            }
        }

        return Maybe.None();
    }),

    "contains": functools.makeProperty('value', function (func) {
        return this.find(func) !== Maybe.None();
    }),

    "zip": functools.makeProperty('value', function (other) {
        var arrayToZip = other.length < this.length ? other : this,
            otherArray = this === arrayToZip ? other : this;

        return arrayToZip.map(function (el, index) {
            return [el, otherArray[index]];
        });
    }),

    "groupBy": functools.makeProperty('value', function (func) {
        var result = {};

        for (var i = 0, length = this.length; i < length; i++) {
            var key = func(this[i]);

            if (!(key in result)) {
                result[key] = [];
            }

            result[key].push(this[i]);
        }

        return result;
    }),

    "prepend": functools.makeProperty('value', function () {
        return Array.from(arguments).concat(this);
    }),

    "append": functools.makeProperty('value', function () {
        return this.concat(Array.from(arguments));
    })
});
},{"./common":2,"./maybe":4}],2:[function(require,module,exports){
function RequireFailedError (reason) {
    this.constructor.call(this, reason);
}

RequireFailedError.prototype = Object.create(Error.prototype);

module.exports = {
    RequireFailedError: RequireFailedError,

    assert: function (booleanExpression, failureMessage) {
        if (!booleanExpression) {
            throw new RequireFailedError(failureMessage);
        }

        return true;
    },

    identity: function (value) {
        return value;
    },

    noop: function () {},

    hasFlatMap: function (val) {
        return (typeof val === "object" || typeof val === "function") && typeof val.flatMap === "function";
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
    }
};
},{}],3:[function(require,module,exports){
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

},{"./array":1,"./common":2,"./maybe":4}],4:[function(require,module,exports){
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
},{"./common":2}],5:[function(require,module,exports){
var functools = require('./common');

Object.defineProperties(Number.prototype, {
    "times": functools.makeProperty('value', function () {
        var result = [];

        for (var i = 0; i < this; i++) {
            result.push(i);
        }

        return result;
    })
});
},{"./common":2}],6:[function(require,module,exports){
Object.defineProperties(Object, {
    "zip": {
        value: function (arrayOfPairs) {
            var result = {};

            for (var i = 0, length = arrayOfPairs.length; i < length; i++) {
                result[arrayOfPairs[i][0]] = arrayOfPairs[i][1];
            }

            return result;
        }
    },

    "unzip": {
        value: function () {
            var result = [];

            for (var key in this) {
                if (this.hasOwnProperty(key)) {
                    result.push([this, this[key]]);
                }
            }

            return result;
        }
    }
});
},{}],7:[function(require,module,exports){
var functools = require('./common');

Object.defineProperties(String.prototype, {
    "contains": functools.makeProperty('value', function (string) {
        return !!~this.indexOf(string);
    }),

    "startswith": functools.makeProperty('value', function (string) {
        return this.indexOf(string) === 0;
    })
});
},{"./common":2}],8:[function(require,module,exports){
require('./app/array');
require('./app/object');
require('./app/string');
require('./app/number');
require('./app/hashmap');

var functionalify = {
    common: require('./app/common'),
    Maybe: require('./app/maybe'),
    Map: require('./app/hashmap')
};

if (typeof window !== 'undefined') {
    window.functionalify = window._ = functionalify;
}

module.exports = functionalify;
},{"./app/array":1,"./app/common":2,"./app/hashmap":3,"./app/maybe":4,"./app/number":5,"./app/object":6,"./app/string":7}]},{},[8,1,2,3,4,5,6,7]);
