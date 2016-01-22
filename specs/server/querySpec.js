var expect = require('chai').expect,
    request = require('request'),
    url = 'http://localhost:3000/api/';

describe('Query String Handler', function() {

  describe('Sort parameter', function() {

    before(function(done) {
      // Create three test users.
      var signupUser = function(user, cb) {
        request({
          url: url + 'signup',
          method: 'POST',
          json: user
        }, function(){ if(cb) cb(); });
      };

      signupUser({username: 'Bob', password: 'c'});
      signupUser({username: 'Susan', password: 'a'});
      signupUser({username: 'Alejandro', password: 'b'}, done);

    });

    after(function(done) {
      // Delete the test users.
      var deleteUser = function(username, cb) {
        request({
          url: url + 'users/' + username,
          method: 'DELETE'
        }, function(){ if(cb) cb(); });
      };

      deleteUser('Bob');
      deleteUser('Susan');
      deleteUser('Alejandro', done);

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


    it('should sort users in descending order', function() {
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