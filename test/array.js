require('..');
require('chai').should();
var expect = require('chai').expect;

describe('Array', function () {
    describe('Class Methods', function () {
        describe('isArray', function () {
            it('should be true for actual arrays', function () {
                Array.isArray([]).should.be.true;
            });

            it('should be false for array-like objects', function () {
                Array.isArray({ 0: "foo", length: 1 }).should.be.false;
                (function () {
                    Array.isArray(arguments).should.be.false;
                })("foo", "bar");
                Array.isArray(function () {}).should.be.false;
            });
        });

        describe('from', function () {
            it('should convert an array-like to an array', function () {
                (function () {
                    var converted = Array.from(arguments);
                    Array.isArray(converted).should.be.true;
                    expect(converted).to.include.members(["foo", "bar"]);
                })("foo", "bar");

                var obj = Array.from({ 0: 1, 1: 2, length: 2 });
                Array.isArray(obj).should.be.true;
                expect(obj).to.include.members([1]);
            });

            it('should fail on undefined or null values', function () {
                expect(function () {
                    Array.from(undefined);
                }).to.throw(TypeError);

                expect(function () {
                    Array.from(null);
                }).to.throw(TypeError);
            });
        });
    });


    describe('Methods', function () {
        describe('isEmpty', function () {
            it('should be true for an empty array', function () {
                ([].isEmpty).should.be.true;
            });

            it('should be false for a non-empty array', function () {
                (["foo"].isEmpty).should.be.false;
            });
        });


        describe('nonEmpty', function () {
            it('should be true for a non-empty array', function () {
                (["foo"].nonEmpty).should.be.true;
            });

            it('should be false for an empty array', function () {
                ([].nonEmpty).should.be.false;
            });
        });
    });
});