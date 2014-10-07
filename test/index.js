var expect = require('chai').expect,
    functionalify = require('..');

describe('Utilities', function () {
    var common = functionalify.common;
    describe('identity', function () {
        it('should return itself on identity', function () {
            expect(common.identity("foobar")).to.equal("foobar");
        });

        it('should be a void function on identity', function () {
            expect(common.noop("foobar")).to.be.undefined;
        });
    });

    describe('assert', function () {
        it('should throw an error if assertion is false', function () {
            expect(function () {
                common.assert(false, "This is a failure");
            }).to.throw(common.RequireFailedError);
        });

        it('should not throw an error if the assertion is true', function () {
            expect(function () {
                common.assert(true, "This is a failure");
            }).to.not.throw(common.RequireFailedError).and.to.be.true;
        });
    });
});