require('chai').should();
var expect = require('chai').expect,
    functionalify = require('..'),
    Maybe = require('..').Maybe;

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
                Array.isArray(function () {
                }).should.be.false;
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


    describe('Emptiness', function () {
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

    describe('Flatten and flatmap', function () {
        describe('flatten', function () {
            it('should take an array of array and convert it to an array', function () {
                var arrayOfArrays = [
                    [1, 2],
                    [3, 4],
                    [5, 6]
                ];
                arrayOfArrays.flatten().should.include.members([1, 2, 3, 4, 5, 6]);
            });

            it('should take a mixed array and returned a flattened array', function () {
                var mixedArray = [1, 2, [3, 4], 5, [6, 7]];
                mixedArray.flatten().should.include.members([1, 2, 3, 4, 5, 6]);
            });
        });


        describe('flatMap', function () {
            it('should take an array of maybes and give back the values', function () {
                var maybes = [Maybe(1), Maybe(null), Maybe(), Maybe(2)];
                maybes.flatMap(function (value) {
                    return value * 5;
                }).map(function (maybe) {
                    return maybe.getOrElse('');
                }).should.include.members([5, '', 10]);
            });
        });
    });


    describe('Slices', function () {
        var empty = [],
            nonempty = [1, 2, 3, 4];
        describe('head', function () {
            it('should get the head if the array is nonempty', function () {
                nonempty.head.should.equal(1);
            });

            it('should throw a ReferenceError if the array is empty', function () {
                expect(function () {
                    empty.head;
                }).to.throw(ReferenceError);
            });
        });

        describe('last', function () {
            it('should get the final member if the array is nonempty', function () {
                nonempty.last.should.equal(4);
            });

            it('should throw a ReferenceError if the array is empty', function () {
                expect(function () {
                    empty.last;
                }).to.throw(ReferenceError);
            });
        });
    });
});