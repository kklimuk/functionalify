var functools = require('./common');

Object.defineProperties(String.prototype, {
    "contains": functools.makeProperty('value', function (string) {
        return !!~this.indexOf(string);
    }),

    "startswith": functools.makeProperty('value', function (string) {
        return this.indexOf(string) === 0;
    })
});