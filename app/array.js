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