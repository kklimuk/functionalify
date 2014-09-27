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

        describe('tail', function () {
           it('should return the members of the array besides the head if nonempty', function () {
               nonempty.tail.should.not.include(1);
               nonempty.tail.should.include.members([2, 3, 4]);
               nonempty.tail.should.have.length(3);
           });

           it('should return an empty array if the array is empty', function () {
               empty.tail.should.be.empty;
           });
        });

        describe('init', function () {
            it('should return the members of the array besides the last if nonempty', function () {
               nonempty.init.should.not.include(4);
               nonempty.init.should.include.members([1, 2, 3]);
               nonempty.init.should.have.length(3);
           });

           it('should return an empty array if the array is empty', function () {
               empty.init.should.be.empty;
           });
        });

        describe('take', function () {
            it('should return at most the size of the array', function () {
                nonempty.take(2).should.have.length(2);
                nonempty.take(0).should.have.length(0);
                nonempty.take(nonempty.length).should.have.length(nonempty.length);
                nonempty.take(nonempty.length + 5).should.have.length(nonempty.length);
            });

            it('should return the right taken values', function () {
                nonempty.take(2).should.include.members([1, 2]);
                nonempty.take(2).should.have.length(2);
            });

            it('should always return empty arrays on taking from one', function () {
                empty.take(0).should.have.length(0);
                empty.take(2).should.have.length(0);
            });
        });

        describe('drop', function () {
            it('should return the right size after dropping', function () {
                nonempty.drop(0).should.have.length(nonempty.length);
                nonempty.drop(2).should.have.length(nonempty.length - 2);
                nonempty.drop(nonempty.length).should.have.length(0);
                nonempty.drop(nonempty.length + 5).should.have.length(0);
            });

            it('should return the right dropped values', function () {
                nonempty.drop(2).should.include.members([3, 4]);
                nonempty.drop(2).should.have.length(nonempty.length - 2);
            });

            it('should always return empty arrays on dropping from one', function () {
                empty.drop(0).should.have.length(0);
                empty.drop(2).should.have.length(0);
            });
        });
    });

    describe('Iteration tools', function () {
        var nonempty = (20).times,
            empty = [];

        describe('partition', function () {
            it('should divide the number array into odds and evens', function () {
                var result = nonempty.partition(function (iteration) {
                    return iteration % 2;
                });

                result.head.should.have.length(10);
                result.head.should.satisfy(function (values) {
                    return values.reduce(function (acc, current) {
                        return !(!acc || !(current % 2));
                    }, true);
                });

                result.last.should.have.length(10);
                result.last.should.satisfy(function (values) {
                    return values.reduce(function (acc, current) {
                        return !(!acc || current % 2);
                    }, true);
                });
            });

            it('should create empty partition for the empty array', function () {
                var result = empty.partition(function (iteration) {
                    return iteration % 2;
                });

                result.head.should.be.empty;
                result.last.should.be.empty;
            });
        });

        describe('takeWhile', function () {
            it('should stop taking after the condition is met', function () {
                var result = nonempty.takeWhile(function (iteration) {
                    return iteration < 10;
                });

                result.should.have.length(10);
                result.should.not.include.members([10, 11, 12, 13, 14, 15, 16, 17, 18, 19]);
                result.should.include.members((10).times);
            });

            it('should return nothing for an empty array', function () {
                empty.takeWhile(function () {
                    return true;
                }).should.be.empty;
            });
        });

        describe('dropWhile', function () {
            it('should stop dropping after the condition is met', function () {
                var result = nonempty.dropWhile(function (iteration) {
                    return iteration < 10;
                });

                result.should.have.length(10);
                result.should.not.include.members((10).times);
                result.should.include.members([10, 11, 12, 13, 14, 15, 16, 17, 18, 19]);
            });

            it('should return nothing for an empty array', function () {
                empty.dropWhile(function () {
                    return true;
                }).should.be.empty;
            });
        });
    });
});