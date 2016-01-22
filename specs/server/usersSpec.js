var expect = require('chai').expect,
    request = require('request'),
    url = 'http://localhost:3000/api/';

describe('Authentication', function() {

  describe('Signing up a new user', function() {
    var username = 'Bob';
    var password = '123';

    it('should create a new user', function (done) {

      request({
        method: 'POST',
        url: url + 'signup',
        json: {
          username: username,
          password: password
        }
      }, function (err, res, body) {

        expect(body).to.have.property('username');
        expect(body.username).to.equal(username);

        done();
      });

    });

    it('should retrieve a user it created', function (done) {

      request(url + 'users/' + username, function (err, res, body) {
        expect(body).to.have.property('username');
        expect(body.username).to.equal(username);

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

      });

    });

  });

});