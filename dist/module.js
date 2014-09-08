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
    "isEmpty": {
        get: function () {
            return this.length === 0;
        }
    },

    "nonEmpty": {
        get: function () {
            return !this.isEmpty;
        }
    },

    "flatMap": {
        value: function (func) {
            return this.map(func).flatten();
        }
    },

    "flatten": {
        value: function () {
            var result = [];

            for (var i = 0, length = this.length; i < length; i++) {
                if (functools.hasFlatMap(this[i])) {
                    result.push.apply(result, this[i].flatMap(functools.identity));
                } else {
                    result.push(this[i]);
                }
            }

            return result;
        }
    },

    "head": {
        get: function () {
            return Maybe(this[0]);
        }
    },

    "last": {
        get: function () {
            return this.length === 0 ? Maybe.None() : Maybe(this[this.length - 1]);
        }
    },

    "init": {
        get: function () {
            return this.length === 0 ? [] : this.slice(0, this.length - 1);
        }
    },

    "tail": {
        get: function () {
            return this.length === 0 ? [] : this.slice(1);
        }
    },

    "take": {
        value: function (num) {
            return this.slice(0, num);
        }
    },

    "drop": {
        value: function (num) {
            return this.slice(num);
        }
    },

    "partition": {
        value: function (func) {
            var a = [], b = [];
            for (var i = 0, length = this.length; i < length; i++) {
                func(this[i]) ? a.push(this[i]) : b.push(this[i]);
            }
            return [a, b];
        }
    },

    "takeWhile": {
        value: function (func) {
            for (var i = 0, length = this.length; i < length; i++) {
                if (!func(this[i])) {
                    return this.slice(0, i);
                }
            }
            return this.slice(0);
        }
    },

    "dropWhile": {
        value: function (func) {
            for (var i = 0, length = this.length; i < length; i++) {
                if (!func(this[i])) {
                    return this.slice(i);
                }
            }
            return [];
        }
    },

    "every": {
        value: function (func) {
            for (var i = 0, length = this.length; i < length; i++) {
                if (!func(this[i])) {
                    return false;
                }
            }
            return true;
        }
    },

    "any": {
        value: function (func) {
            for (var i = 0, length = this.length; i < length; i++) {
                if (func(this[i])) {
                    return true;
                }
            }

            return false;
        }
    },

    "find": {
        value: function (func) {
            for (var i = 0, length = this.length; i < length; i++) {
                if (func(this[i])) {
                    return Maybe(this[i]);
                }
            }

            return Maybe.None();
        }
    },

    "contains": {
        value: function (func) {
            return this.find(func) !== Maybe.None();
        }
    },

    "zip": {
        value: function (other) {
            var arrayToZip = other.length < this.length ? other : this,
                otherArray = this === arrayToZip ? other : this;

            return arrayToZip.map(function (el, index) {
                return [el, otherArray[index]];
            });
        }
    },

    "groupBy": {
        value: function (func) {
            var result = {};
            for (var i = 0, length = this.length; i < length; i++) {
                var key = func(this[i]);
                if (!(key in result)) {
                    result[key] = [];
                }

                result[key].push(this[i]);
            }
            return result;
        }
    },

    "prepend": {
        value: function () {
            return Array.from(arguments).concat(this);
        }
    },

    "append": {
        value: function () {
            return this.concat(Array.from(arguments));
        }
    }
});
},{"./common":2,"./maybe":3}],2:[function(require,module,exports){
module.exports = {
    identity: function (value) { return value; },
    noop: function () {},
    hasFlatMap: function (val) {
        return (typeof val === "object" || typeof val === "function") && typeof val.flatMap === "function";
    }
};
},{}],3:[function(require,module,exports){
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
},{"./common":2}],4:[function(require,module,exports){
Object.defineProperties(Number.prototype, {
    "times": {
        get: function () {
            var result = [];
            for (var i = 0; i < this; i++) {
                result.push(i);
            }
            return result;
        }
    }
});
},{}],5:[function(require,module,exports){
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

var mapper = function (mapping, ignoreError) {
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
    }
};

Object.defineProperties(Object.prototype, {
    "isEmpty": {
        get: function () {
            return Object.keys(this).length === 0;
        }
    },

    "keys": {
        get: function () {
            return Object.keys(this);
        }
    },

    "values": {
        get: function () {
            return Object.keys(this).map(function (key) {
                return this[key];
            });
        }
    },

    "nonEmpty": {
        get: function () {
            return !this.isEmpty;
        }
    },

    "map": {
        value: mapper(functools.identity),
        writable: true
    },

    "foreach": {
        value: function () {
            mapper(functools.identity, true).apply(this, arguments);
        },
        writable: true
    },

    "flatMap": {
        value: mapper(function (value) {
            return functools.hasFlatMap(value) ? value.flatMap(functools.identity) : value;
        }),
        writable: true
    },

    "filter": {
        value: function (func) {
            var result = {};
            for (var key in this) {
                if (this.hasOwnProperty(key) && func(this[key], key, this)) {
                    result[key] = this[key];
                }
            }
            return result;
        },
        writable: true
    }
});
},{"./common":2}],6:[function(require,module,exports){
Object.defineProperties(String.prototype, {
    "contains": {
        value: function (string) {
            return !!~this.indexOf(string);
        }
    },

    "startswith": {
        value: function (string) {
            return this.indexOf(string) === 0;
        }
    }
});
},{}],7:[function(require,module,exports){
require('./app/array');
require('./app/object');
require('./app/string');
require('./app/number');

var functionalify = {
    common: require('./app/common'),
    Maybe: require('./app/maybe')
};

if (typeof window !== 'undefined') {
    window.functionalify = functionalify;
}

module.exports = functionalify;
},{"./app/array":1,"./app/common":2,"./app/maybe":3,"./app/number":4,"./app/object":5,"./app/string":6}]},{},[7,1,2,3,4,5,6]);
