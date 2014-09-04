var expect = require('chai').expect,
    functools = require('..');

describe('functools', function() {
  it('should say hello', function(done) {
    expect(functools()).to.equal('Hello, world');
    done();
  });
});
