/*global Set:true */

var Set = require('..').Set,
    expect = require('chai').expect;

require('chai').should();

describe('Set', function () {
    var date = new Date(),
        object = {},
        func = function() {},
        set = Set("foo", 123, date, object, func);

    it('should be true for present members', function () {
        set("foo").should.be.true;
        set(123).should.be.true;
        set(date).should.be.true;
        set(object).should.be.true;
        set(func).should.be.true;
    });

    it('should be false for non-present members', function () {
        set("bar").should.be.false;
        set(321).should.be.false;
    });
});