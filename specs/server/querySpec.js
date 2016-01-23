process.env.NODE_ENV = 'test'; // disable morgan

var expect = require('chai').expect,
    request = require('request'),
    url = 'http://localhost:3000/api/';

xdescribe('Query String Handler', function() {

  describe('Sort parameter', function() {

    before(function(done) {
      // Create three test users.
      User({username: 'Bob', password: 'c'}).save()
        .then(function() {
          User({username: 'Susan', password: 'a'}).save()
            .then(function() {
              User({username: 'Alejandro', password: 'b'}).save()
                .then(function() {
                  done();
                });
            });
        });
    });

    after(function(done) {
      // Delete the test users.
      User.findOne({username: 'Bob'})
        .then(function (user) {
          user.remove();
        });
      User.findOne({username: 'Susan'})
        .then(function (user) {
          user.remove();
        });
      User.findOne({username: 'Alejandro'})
        .then(function (user) {
          user.remove();
          done();
        });
    });


    it('should sort users by username', function(done) {
      request(url + 'users?sort=username', function(err, res, body) {
        var users = JSON.parse(body);

        expect(users[0].username).to.equal('Alejandro');
        expect(users[1].username).to.equal('Bob');
        expect(users[2].username).to.equal('Susan');
        done();
      });

    });


    it('should not sort users by password', function(done) {
      request(url + 'users?sort=password', function(err, res, body) {
        var users = JSON.parse(body);

        expect(users[0].username).to.not.equal('Susan');
        expect(users[1].username).to.not.equal('Alejandro');
        expect(users[2].username).to.not.equal('Bob');
        done();
      });
    });


    it('should sort users in descending order', function(done) {
      request(url + 'users?sort=-username', function(err, res, body) {
        var users = JSON.parse(body);

        expect(users[0].username).to.equal('Susan');
        expect(users[1].username).to.equal('Bob');
        expect(users[2].username).to.equal('Alejandro');
        done();
      });
    });

  });

});