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
        value: function (object) {
            var result = [];

            for (var key in object) {
                if (object.hasOwnProperty(key)) {
                    result.push([key, object[key]]);
                }
            }

            return result;
        }
    }
});