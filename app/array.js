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
        var result = [];

        for (var i = 0, length = this.length; i < length; i++) {
            if (functools.hasFlatMap(this[i])) {
                var flatMapped = this[i].flatMap(func);
                if (flatMapped.length) {
                    result.push.apply(result, flatMapped);
                } else {
                    result.push(flatMapped);
                }
            } else {
                result.push(func(this[i]));
            }
        }

        return result;
    }),

    "flatten": makeProperty('value', function () {
        return this.flatMap(functools.identity);
    }),

    "head": makeProperty('get', function () {
        return this[0];
    }),

    "tail": makeProperty('get', function () {
        return this.length === 0 ? [] : this.slice(1);
    }),

    "last": makeProperty('get', function () {
        return this[this.length - 1];
    }),

    "init": makeProperty('get', function () {
        return this.length === 0 ? [] : this.slice(0, this.length - 1);
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

    "some": makeProperty('value', function (func) {
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
                return this[i];
            }
        }
        return undefined;
    }),

    "contains": makeProperty('value', function (func) {
        return !!this.find(func);
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