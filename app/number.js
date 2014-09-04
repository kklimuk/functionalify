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