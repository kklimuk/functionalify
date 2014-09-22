var functools = require('./common'),
    utils = require('./utils'),
    Maybe = require('./maybe');

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
    "isEmpty": utils.makeProperty('get', function () {
        return this.length === 0;
    }),

    "nonEmpty": utils.makeProperty('get', function () {
        return !this.isEmpty;
    }),

    "flatMap": utils.makeProperty('value', function (func) {
        return this.map(func).flatten();
    }),

    "flatten": utils.makeProperty('value', function () {
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

    "head": utils.makeProperty('get', function () {
        return Maybe(this[0]);
    }),

    "last": utils.makeProperty('get', function () {
        return this.length === 0 ? Maybe.None() : Maybe(this[this.length - 1]);
    }),

    "init": utils.makeProperty('get', function () {
        return this.length === 0 ? [] : this.slice(0, this.length - 1);
    }),

    "tail": utils.makeProperty('get', function () {
        return this.length === 0 ? [] : this.slice(1);
    }),

    "take": utils.makeProperty('value', function (num) {
        return this.slice(0, num);
    }),

    "drop": utils.makeProperty('value', function (num) {
        return this.slice(num);
    }),

    "partition": utils.makeProperty('value', function (func) {
        var a = [], b = [];
        for (var i = 0, length = this.length; i < length; i++) {
            var pushTo = func(this[i]) ? a : b;
            pushTo.push(this[i]);
        }
        return [a, b];
    }),

    "takeWhile": utils.makeProperty('value', function (func) {
        for (var i = 0, length = this.length; i < length; i++) {
            if (!func(this[i])) {
                return this.slice(0, i);
            }
        }
        return this.slice(0);
    }),

    "dropWhile": utils.makeProperty('value', function (func) {
        for (var i = 0, length = this.length; i < length; i++) {
            if (!func(this[i])) {
                return this.slice(i);
            }
        }
        return [];
    }),

    "every": utils.makeProperty('value', function (func) {
        for (var i = 0, length = this.length; i < length; i++) {
            if (!func(this[i])) {
                return false;
            }
        }
        return true;
    }),

    "any": utils.makeProperty('value', function (func) {
        for (var i = 0, length = this.length; i < length; i++) {
            if (func(this[i])) {
                return true;
            }
        }

        return false;
    }),

    "find": utils.makeProperty('value', function (func) {
        for (var i = 0, length = this.length; i < length; i++) {
            if (func(this[i])) {
                return Maybe(this[i]);
            }
        }

        return Maybe.None();
    }),

    "contains": utils.makeProperty('value', function (func) {
        return this.find(func) !== Maybe.None();
    }),

    "zip": utils.makeProperty('value', function (other) {
        var arrayToZip = other.length < this.length ? other : this,
            otherArray = this === arrayToZip ? other : this;

        return arrayToZip.map(function (el, index) {
            return [el, otherArray[index]];
        });
    }),

    "groupBy": utils.makeProperty('value', function (func) {
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

    "prepend": utils.makeProperty('value', function () {
        return Array.from(arguments).concat(this);
    }),

    "append": utils.makeProperty('value', function () {
        return this.concat(Array.from(arguments));
    })
});