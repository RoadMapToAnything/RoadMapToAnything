describe('The Mocha-Chai testing suite', function() {

  describe('Comparing Numbers', function() {

    it('is expected to know 2 + 2 equals 4', function() {
      expect( 2 + 2 ).to.equal(4);
    });

    it('is expected to know 5 is less than 10', function() {
      expect(5).to.be.lessThan(1);
      expect(5).to.be.below(10);
    });

  });

  describe('Checking Booleans', function() {

    it('is expected to know what a boolean is', function() {
      expect( 3 >= 2 ).to.be.a('boolean');
    });

    it('is expected to be able to check booleans', function() {
      expect( 5 === 10 ).to.be.false;
    });

  });

  describe('Strings with Should', function() {

    it('should know what a string is', function() {
      'abc'.should.be.a('string');
    });

    it('should be able to check length', function() {
      var str = 'abc';
      str.should.have.length(3);
    });

  });

  describe('Objects with Should', function() {
    var obj = {a: 1, b: 2, c: 3};

    it('should know what an object is', function() {
      obj.should.be.an('object');
    });

    it('should be able to check properties', function() {
      obj.should.have.property('a');
      obj.should.have.property('b', 2);
      obj.should.have.property('c').that.is.a('number');
    });

    it('should be able to check deep equality', function() {
      var deepObj = {a: {b: 3}};

      obj.should.not.equal({a: 1, b: 2, c: 3});
      obj.should.deep.equal({a: 1, b: 2, c: 3});

      deepObj.should.have.deep.property('a.b', 3);
    });

  });

});
