var expect = require('chai').expect;
var should = require('chai').should();

describe('Testing the server', function() {

  it('should have a function called require', function() {
    require.should.exist;
    require.should.be.a('function');
  });

});