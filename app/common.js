module.exports = {
    identity: function (value) { return value; },
    noop: function () {},
    hasFlatMap: function (val) {
        return (typeof val === "object" || typeof val === "function") && typeof val.flatMap === "function";
    }
};