module.exports = {
    identity: function (value) { return value; },
    noop: function () {},
    hasFlatMap: function (val) {
        return (typeof val === "object" || typeof val === "function") && typeof val.flatMap === "function";
    },
    makeProperty: function (type, func) {
        var prop = {
            writable: true
        };
        prop[type] = func;

        return prop;
    }
};