// Karma handles declaring 'expect' and 'should' automatically.
describe('Testing through the browser.', function() {

  it('is should have a window and a document body', function() {
    window.should.exist;
    document.body.should.exist;
  });

  it('is expected to not be able to use require', function() {
    expect(typeof require).to.equal('undefined');
  });

});
