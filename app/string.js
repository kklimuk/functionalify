Object.defineProperty(String.prototype, "contains", {
    value: function (string) {
        return !!~this.indexOf(string);
    }
});