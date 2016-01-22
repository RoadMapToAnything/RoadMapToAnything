process.env.NODE_ENV = 'test'; // disable morgan

var expect = require('chai').expect,
    request = require('request'),
    url = 'http://localhost:3000/api/';

// Create a describe equivalent of 'xit' to disable blocks of tests
var xdescribe = function () {};



xdescribe('The users API', function() {

  describe('Authentication', function() {
    var username = 'Bob';
    var password = '123';

    after(function (done) {

      request({
        method: 'DELETE',
        url: url + '/users/' + username
      }, function (err, red, body) {
        done();
      });

    });

    it('should create a new user', function (done) {

      request({
        method: 'POST',
        url: url + 'signup',
        json: {
          username: username,
          password: password
        }
      }, function (err, res, body) {
        expect(body).to.have.property('username', username);
        done();
      });

    });

    it('should be able to log in', function (done) {

      request({
        url: url + 'login',
        qs: {
          username: username,
          password: password
        }
      }, function (err, res, body) {
        var user = JSON.parse(body);
        
        expect(user).to.have.property('username', username);
        done();
      });

    });

  });

  describe('Fetching Users', function() {

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

    it('should retrieve a specifc user', function (done) {

      request(url + 'users/Bob', function (err, res, body) {
        var user = JSON.parse(body);
        
        expect(user).to.have.property('username', 'Bob');
        done();
      });

    });

    it('should retrieve an array of users', function (done) {

      request(url + 'users', function (err, res, body) {
        var users = JSON.parse(body);

        expect(users).to.be.an('array');
        expect(users).to.not.be.empty;
        expect(users).to.have.deep.property('[0].username');

        done();
      });

    });

  });

});