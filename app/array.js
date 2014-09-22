var functools = require('./common'),
    assert = functools.assert,
    makeProperty = functools.makeProperty,
    Maybe = require('./maybe');

Object.defineProperties(Array, {
    "isArray": { // credit: Douglas Crockford
        value: function (value) {
            return value && typeof value === 'object' &&
                typeof value.length === 'number' &&
                typeof value.splice === 'function' && !(value.propertyIsEnumerable('length'));
        }
    },

    // Array.from(array-like)
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from
    "from": {
        value: function (value, mapper, thisArg) {
            if (!functools.exists(value)) {
                throw new TypeError('The value to convert must not be null or undefined.');
            }

            var array = Array.prototype.slice.call(value);

            if (typeof mapper !== 'undefined') {
                return array.map(mapper, thisArg);
            }

            return array;
        }
    }
});

Object.defineProperties(Array.prototype, {
    "isEmpty": makeProperty('get', function () {
        return this.length === 0;
    }),

    "nonEmpty": makeProperty('get', function () {
        return this.length > 0;
    }),

    "flatMap": makeProperty('value', function (func) {
        return this.map(func).flatten();
    }),

    "flatten": makeProperty('value', function () {
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

    "head": makeProperty('get', function () {
        return Maybe(this[0]);
    }),

    "last": makeProperty('get', function () {
        return this.length === 0 ? Maybe.None() : Maybe(this[this.length - 1]);
    }),

    "init": makeProperty('get', function () {
        return this.length === 0 ? [] : this.slice(0, this.length - 1);
    }),

    "tail": makeProperty('get', function () {
        return this.length === 0 ? [] : this.slice(1);
    }),

    "take": makeProperty('value', function (num) {
        return this.slice(0, num);
    }),

    "drop": makeProperty('value', function (num) {
        return this.slice(num);
    }),

    "partition": makeProperty('value', function (func) {
        var a = [], b = [];
        for (var i = 0, length = this.length; i < length; i++) {
            var pushTo = func(this[i]) ? a : b;
            pushTo.push(this[i]);
        }
        return [a, b];
    }),

    "takeWhile": makeProperty('value', function (func) {
        for (var i = 0, length = this.length; i < length; i++) {
            if (!func(this[i])) {
                return this.slice(0, i);
            }
        }
        return this.slice(0);
    }),

    "dropWhile": makeProperty('value', function (func) {
        for (var i = 0, length = this.length; i < length; i++) {
            if (!func(this[i])) {
                return this.slice(i);
            }
        }
        return [];
    }),

    "every": makeProperty('value', function (func) {
        for (var i = 0, length = this.length; i < length; i++) {
            if (!func(this[i])) {
                return false;
            }
        }
        return true;
    }),

    "any": makeProperty('value', function (func) {
        for (var i = 0, length = this.length; i < length; i++) {
            if (func(this[i])) {
                return true;
            }
        }

        return false;
    }),

    "find": makeProperty('value', function (func) {
        for (var i = 0, length = this.length; i < length; i++) {
            if (func(this[i])) {
                return Maybe(this[i]);
            }
        }

        return Maybe.None();
    }),

    "contains": makeProperty('value', function (func) {
        return this.find(func) !== Maybe.None();
    }),

    "zip": makeProperty('value', function (other) {
        var arrayToZip = other.length < this.length ? other : this,
            otherArray = this === arrayToZip ? other : this;

        return arrayToZip.map(function (el, index) {
            return [el, otherArray[index]];
        });
    }),

    "groupBy": makeProperty('value', function (func) {
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

    "prepend": makeProperty('value', function () {
        return Array.from(arguments).concat(this);
    }),

    "append": makeProperty('value', function () {
        return this.concat(Array.from(arguments));
    })
});