var functools = require('./common'),
    assert = functools.assert,
    makeProperty = require('./utils').makeProperty,
    hasFlatMap = require('./utils').hasFlatMap,
    commonFlatMap = require('./utils').commonFlatMap,
    HashMap = require('./hashmap');

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
        return commonFlatMap(this, func);
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
        if (!Array.isArray(other)) {
            throw new TypeError('Zip requires an array.');
        }

        var arrayToZip = other.length < this.length ? other : this,
            otherArray = this === arrayToZip ? other : this;

        return arrayToZip.map(function (el, index) {
            return [el, otherArray[index]];
        });
    }),

    "groupBy": makeProperty('value', function (func) {
        var map = HashMap();

        for (var i = 0, length = this.length; i < length; i++) {
            var key = func(this[i]);

            if (!functools.exists(map(key))) {
                map = map.add([key, []]);
            }

            map(key).push(this[i]);
        }

        return map;
    }),

    "prepend": makeProperty('value', function () {
        this.unshift.apply(this, arguments);
        return this;
    }),

    "append": makeProperty('value', function () {
        this.push.apply(this, arguments);
        return this;
    }),

    "immutableAppend": makeProperty('value', function () {
        return this.concat(Array.from(arguments));
    }),

    "immutablePrepend": makeProperty('value', function () {
        return Array.from(arguments).concat(this);
    })
});