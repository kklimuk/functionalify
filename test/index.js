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

    describe('hasFlatMap', function () {
        it('should return true on arrays', function () {
            expect(common.hasFlatMap([])).to.be.true;
        });

        it('should return true on maybes', function () {
            expect(common.hasFlatMap(functionalify.Maybe(1))).to.be.true;
        });

        it('should return false on any function where flatmap is unavailable', function () {
            expect(common.hasFlatMap({})).to.be.false;
            expect(common.hasFlatMap(function () {})).to.be.false;
        });
    });

    describe('makeProperty', function () {
        it('should have a get property if the type is get', function () {
            expect(common.makeProperty('get', common.noop)).to.have.property('get', common.noop);
        });

        it('should have a value property if the type is value', function () {
            expect(common.makeProperty('value', common.noop)).to.have.property('value', common.noop);
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