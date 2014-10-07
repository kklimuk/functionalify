var expect = require('chai').expect,
    functionalify = require('..');

require('chai').should();

describe('Internal Utilities', function () {
    var common = functionalify.common,
        utils = require('../app/utils');

    describe('hasFlatMap', function () {
        it('should return true on arrays', function () {
            utils.hasFlatMap([]).should.be.true;
        });

        it('should return true on maybes', function () {
            utils.hasFlatMap(functionalify.Maybe(1)).should.be.true;
        });

        it('should return false on any function where flatmap is unavailable', function () {
            utils.hasFlatMap({}).should.be.false;
            utils.hasFlatMap(function () {}).should.be.false;
        });
    });

    describe('makeProperty', function () {
        it('should have a get property if the type is get', function () {
            expect(utils.makeProperty('get', common.noop)).to.have.property('get', common.noop);
        });

        it('should have a value property if the type is value', function () {
            expect(utils.makeProperty('value', common.noop)).to.have.property('value', common.noop);
        });
    });

    describe('nativeHashing', function () {
        var mutableObject = {},
            map = utils.nativeHashing([[418, "hello"], ["world", "I'm a teapot"], [mutableObject, 1234]]);

        it('should be able retrieve primitive keys', function () {
            utils.nativeHashing.getKeyFrom(418, map).should.equal("hello");
            utils.nativeHashing.getKeyFrom("world", map).should.equal("I'm a teapot");
        });

        it('should not retrieve a value for an object with the same properties ' +
            'but a different reference as a key', function () {
            expect(utils.nativeHashing.getKeyFrom({}, map)).to.not.exist;
        });

        it('should be able to retrieve mutable objects', function () {
            utils.nativeHashing.getKeyFrom(mutableObject, map).should.equal(1234);
            mutableObject.foo = "bar";
            utils.nativeHashing.getKeyFrom(mutableObject, map).should.equal(1234);
        });
    });
});