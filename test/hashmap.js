/*global Map:true */

var Map = require('..').Map,
    should = require('chai').should,
    expect = require('chai').expect;

should();

describe('Map', function () {
    var map = Map({
        "foo": "bar",
        "123": 321
    }, ["taco", "belle"]);

    it('should be able to create a map from an object', function (done) {
        map("foo").should.equal("bar");
        map("123").should.equal(321);
        map("taco").should.equal("belle");
    });

    it('should throw a reference error when called on a nonexisting key', function () {
        expect(function () {
            map("freedom!");
        }).to.throw(ReferenceError);
    });
});