var expect = require('chai').expect,
    functionalify = require('..');

describe('Internal Utilities', function () {
    var common = functionalify.common,
        utils = require('../app/utils');

    describe('hasFlatMap', function () {
        it('should return true on arrays', function () {
            expect(utils.hasFlatMap([])).to.equal(true);
        });

        it('should return true on maybes', function () {
            expect(utils.hasFlatMap(functionalify.Maybe(1))).to.equal(true);
        });

        it('should return false on any function where flatmap is unavailable', function () {
            expect(utils.hasFlatMap({})).to.equal(false);
            expect(utils.hasFlatMap(function () {})).to.equal(false);
        });
    });

    describe('makeProperty', function () {
        it('should have a get property if the type is get', function () {
            expect(utils.makeProperty('get', common.noop).hasOwnProperty('get')).to.equal(true);
        });

        it('should have a value property if the type is value', function () {
            expect(utils.makeProperty('value', common.noop).hasOwnProperty('value')).to.equal(true);
        });
    });
});