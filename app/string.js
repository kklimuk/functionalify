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