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

    it('should be able to create a map from an object', function () {
        map("foo").should.equal("bar");
        map("123").should.equal(321);
        map("taco").should.equal("belle");
    });

    it('should be undefined for a non-existing key', function () {
        expect(map("freedom")).to.be.undefined;
    });
});