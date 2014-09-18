var expect = require('chai').expect,
    functionalify = require('..');

describe('common', function () {
    var common = functionalify.common;
    describe('helpers', function () {
        it('should return itself on identity', function () {
            expect(common.identity("foobar")).to.equal("foobar");
        });

        it('should be a void function on identity', function () {
            expect(common.noop("foobar")).to.equal(undefined);
        });
    });

    describe('hasFlatMap', function () {
        it('should return true on any object', function () {
            expect(common.hasFlatMap({})).to.equal(true);
            expect(common.hasFlatMap([])).to.equal(true);
            expect(common.hasFlatMap(functionalify.Maybe(1))).to.equal(true);
        });

//        it('should return false on any function where flatmap is unavailable', function () {
//            expect(common.hasFlatMap(function () {})).to.equal(false);
//        });
    });
});
