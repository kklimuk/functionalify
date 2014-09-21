/*global Map:true */

var Map = require('..').Map,
    should = require('chai').should,
    expect = require('chai').expect;

should();

describe('Map', function () {
    var mutableObject = {},
        map = Map([418, "hello"], ["world", "I'm a teapot"], [mutableObject, 1234]);

    it('should be able retrieve primitive keys', function () {
        map(418).should.equal("hello");
        map("world").should.equal("I'm a teapot");
    });

    it('should not retrieve a value for an object with the same properties ' +
        'but a different reference as a key', function () {
        expect(function () {
            map({});
        }).to.throw(ReferenceError);
    });

//    it('should ')

    it('should be able to retrieve mutable objects', function () {
        map(mutableObject).should.equal(1234);
        mutableObject.foo = "bar";
        map(mutableObject).should.equal(1234);
    });

});