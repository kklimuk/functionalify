module.exports = {
    identity: function (value) {
        return value;
    },
    noop: function () {
    },
    hasFlatMap: function (val) {
        return (typeof val === "object" || typeof val === "function") && typeof val.flatMap === "function";
    },

    makeProperty: function (type, func) {
        if (type === 'get') {
            return {
                get: func,
                enumerable: false
            }
        }
        return {
            writable: true,
            value: func,
            enumerable: false
        };
    }
};