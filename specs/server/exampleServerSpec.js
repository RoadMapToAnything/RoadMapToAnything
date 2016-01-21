var expect = require('chai').expect;
var should = require('chai').should();

describe('Testing the server', function() {

  it('is expected to not have a window or a document', function() {
    expect(typeof window).to.equal('undefined');
    expect(typeof document).to.equal('undefined');
  });

  it('should have a function called require', function() {
    require.should.exist;
    require.should.be.a('function');
  });

});