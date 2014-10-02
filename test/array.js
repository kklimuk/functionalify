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
                expect(obj).to.include(1);
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
                mixedArray.flatten().should.include.members((6).times.map(function (count) {
                    return count + 1;
                }));
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

            it('should return undefined in an array without a head', function () {
                expect(empty.head).to.be.undefined;
            });
        });

        describe('last', function () {
            it('should get the final member if the array is nonempty', function () {
                nonempty.last.should.equal(4);
            });

            it('should return undefined in an array without a last', function () {
                expect(empty.last).to.be.undefined;
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

    describe('Element presence', function () {
        var nonempty = (10).times;

        describe('every', function () {
            it('should return false if every element does not meet the requirement', function () {
                nonempty.every(function (iteration) {
                    return iteration < 5;
                }).should.be.false;
            });

            it('should return true if every element meets the requirement', function () {
                nonempty.every(function (iteration) {
                    return iteration < 10;
                }).should.be.true;
            });
        });

        describe('some', function () {
            it('should return false if no element meets the requirement', function () {
                nonempty.some(function (iteration) {
                    return iteration > 10;
                }).should.be.false;
            });

            it('should return true if some element meets the requirement', function () {
                nonempty.some(function (iteration) {
                    return iteration > 8;
                }).should.be.true;
            });
        });

        describe('find', function () {
            it('should return the value if the element is in the array', function () {
                nonempty.find(function (value) {
                    return value === 5;
                }).should.equal(5);
            });

            it('should return undefined if element not found', function () {
                expect(nonempty.find(function () {
                    return false;
                })).to.be.undefined;
            });
        });

        describe('contains', function () {
            it('should return true if the element is in the array', function () {
                nonempty.contains(function (value) {
                    return value === 5;
                }).should.be.true;
            });

            it('should return false if the element is not in the array', function () {
                nonempty.contains(function () {
                    return false;
                }).should.be.false;
            });
        });
    });

    describe('Grouping', function () {
        describe('zip', function () {
            it('should take two arrays and create tuples from each element', function () {
                var first = (5).times,
                    second = (5).times,
                    result = first.zip(second);

                result.reduce(function (acc, element) {
                    return acc &&
                        (Array.isArray(element) && element.length === 2) &&
                        element.head === element.last;
                }, {}).should.be.true;
            });

            it('should take the shorter of the two arrays for zipping', function () {
                var longer = (10).times,
                    shorter = (5).times;

                shorter.zip(longer).should.have.length(5);
                longer.zip(shorter).should.have.length(5);
            });

            it('should required that both of the zipped items be arrays', function () {
                var arr = (5).times;
                expect(function () {
                    arr.zip(7);
                }).to.throw(TypeError);
            });
        });

        describe('groupBy', function () {
            it('should create a hashmap of arrays', function () {
                var result = (10).times.groupBy(function (iteration) {
                    return iteration % 2;
                });

                result(0).should.have.length(5);
                result(0).should.have.members([0, 2, 4, 6, 8]);
                result(1).should.have.length(5);
                result(1).should.have.members([1, 3, 5, 7, 9]);
            });

            it('should crate an empty hashmap if the initial array is empty', function () {
                [].groupBy(function (iter) {
                    return iter % 2;
                }).size.should.equal(0);
            });
        });
    });

    describe('Appending and prepending', function () {
        describe('append', function () {
            it('should add the item as to the last position', function () {
                (5).times.append(5).last.should.equal(5);
            });

            it('should maintain the reference to the original array', function () {
                var array = (5).times,
                    modifiedArray = array.append(5);
                array.should.equal(modifiedArray);
            });
        });

        describe('prepend', function () {
            it('should add the item as to the first position', function () {
                (5).times.prepend(5).head.should.equal(5);
            });

            it('should maintain the reference to the original array', function () {
                var array = (5).times,
                    modifiedArray = array.prepend(5);
                array.should.equal(modifiedArray);
            });
        });

        describe('immutableAppend', function () {
            it('should add the item as to the last position', function () {
                (5).times.immutableAppend(5).last.should.equal(5);
            });

            it('should not maintain the reference to the original array', function () {
                var array = (5).times,
                    modifiedArray = array.immutableAppend(5);
                array.should.not.equal(modifiedArray);
            });
        });

        describe('immutablePrepend', function () {
            it('should add the item as to the first position', function () {
                var array = (5).times;
                array.immutablePrepend(5).head.should.equal(5);
            });

            it('should not maintain the reference to the original array', function () {
                var array = (5).times,
                    modifiedArray = array.immutablePrepend(5);
                array.should.not.equal(modifiedArray);
            });
        });
    });
});