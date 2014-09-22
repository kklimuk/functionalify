function RequireFailedError (reason) {
    this.constructor.call(this, reason);
}

RequireFailedError.prototype = Object.create(Error.prototype);

module.exports = {
    RequireFailedError: RequireFailedError,

    assert: function (booleanExpression, failureMessage) {
        if (!booleanExpression) {
            throw new RequireFailedError(failureMessage);
        }

        return true;
    },

    identity: function (value) {
        return value;
    },

    noop: function () {}
};