var property = require('./utils').makeProperty;

Object.defineProperties(String.prototype, {
    "contains": property('value', function (string) {
        return !!~this.indexOf(string);
    }),

    "startswith": property('value', function (string) {
        return this.indexOf(string) === 0;
    })
});