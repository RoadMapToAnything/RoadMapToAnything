process.env.NODE_ENV = 'test'; // disable morgan

var expect = require('chai').expect,
    request = require('supertest'),
    User = require('../../server/api/users/userModel.js'),

    server = require('../../server/server.js'),
    route = '/api/users';


/* * * * * * * * * * * * * * * * * * * * * * * */
/* * * * * * * * * * * * * * * * * * * * * * * */
/* * * * *        QUERY STRINGS        * * * * */
/* * * * * * * * * * * * * * * * * * * * * * * */
/* * * * * * * * * * * * * * * * * * * * * * * */

describe('Query Strings', function() {

  /* * * * * * * * * * * * * * * * * * * * * 
   *                 SORT                  *
   * * * * * * * * * * * * * * * * * * * * */

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

      request(server.app)
        .get(route)
        .query({sort: 'username'})
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
          expect(res.body[0].username).to.equal('Alejandro');
          expect(res.body[1].username).to.equal('Bob');
          expect(res.body[2].username).to.equal('Susan');
          done();
        });

    });


    it('should not sort users by password', function(done) {

      request(server.app)
        .get(route)
        .query({sort: 'password'})
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
          expect(res.body[0].username).to.not.equal('Susan');
          expect(res.body[1].username).to.not.equal('Alejandro');
          expect(res.body[2].username).to.not.equal('Bob');
          done();
        });

    });


    it('should sort users in descending order', function(done) {

      request(server.app)
        .get(route)
        .query({sort: '-username'})
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
          expect(res.body[0].username).to.equal('Susan');
          expect(res.body[1].username).to.equal('Bob');
          expect(res.body[2].username).to.equal('Alejandro');
          done();
        });

    });

  });

});