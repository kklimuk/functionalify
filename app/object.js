Object.defineProperties(Object, {
    "zip": {
        value: function (arrayOfPairs) {
            var result = {};

            for (var i = 0, length = arrayOfPairs.length; i < length; i++) {
                result[arrayOfPairs[i][0]] = arrayOfPairs[i][1];
            }

            return result;
        }
    },

    "unzip": {
        value: function () {
            var result = [];

            for (var key in this) {
                if (this.hasOwnProperty(key)) {
                    result.push([this, this[key]]);
                }
            }

            return result;
        }
    }
});