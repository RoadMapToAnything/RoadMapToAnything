process.env.NODE_ENV = 'test'; // disable morgan

var expect = require('chai').expect,
    request = require('supertest'),
    User = require('../../server/api/users/userModel.js'),

    server = require('../../server/server.js'),
    route = '/api/users';
    


/* * * * * * * * * * * * * * * * * * * * * * * */
/* * * * * * * * * * * * * * * * * * * * * * * */
/* * * * *        USERS ROUTES         * * * * */
/* * * * *        /api/users           * * * * */
/* * * * *        /api/signup          * * * * */
/* * * * *        /api/login           * * * * */
/* * * * * * * * * * * * * * * * * * * * * * * */
/* * * * * * * * * * * * * * * * * * * * * * * */


describe('The users API', function() {
  var username = 'Bob';
  var password = 'c';


  /* * * * * * * * * * * * * * * * * * * * * 
   *            AUTHENTICATION             *
   * * * * * * * * * * * * * * * * * * * * */

  describe('Authentication', function() {

    after(function (done) {

      User.findOne({username: username})
        .then(function (user) {
          user.remove();
          done();
        });

    });

    it('should create a new user', function (done) {

      request(server.app)
        .post('/api/signup')
        .send({username: username, password: password})
        .expect('Content-Type', /json/)
        .expect(201)
        .end(function (err, res) {

          expect(res.body).to.have.property('username', username);

          User.findOne({username: username})
            .then(function (user) {

              expect(user).to.have.property('username', username);
              done();

            });
          
        });

    });

    it('should be able to log in', function (done) {

      request(server.app)
        .get('/api/login')
        .query({username: username, password: password})
        .expect('Content-Type', /json/)
        .expect(201)
        .end(function (err, res) {

          expect(res.body).to.have.property('username', username);
          done();

        });

    });

  });


  /* * * * * * * * * * * * * * * * * * * * * 
   *           GET /api/users              *
   * * * * * * * * * * * * * * * * * * * * */

  describe('Fetching Users', function() {

    before(function(done) {
      // Create three test users.
      User({username: username, password: password}).save()
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
      User.findOne({username: username})
        .then(function (user) {
          if (user) user.remove();
        });
      User.findOne({username: 'Susan'})
        .then(function (user) {
          if (user) user.remove();
        });
      User.findOne({username: 'Alejandro'})
        .then(function (user) {
          if (user) user.remove();
          done();
        });
    });

    it('should retrieve a specifc user', function (done) {

      request(server.app)
        .get(route + '/' + username)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {

          expect(res.body).to.have.property('username', username);
          done();

        });

    });

    it('should retrieve an array of users', function (done) {

      request(server.app)
        .get(route)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {

          expect(res.body).to.be.an('array');
          expect(res.body).to.not.be.empty;
          expect(res.body).to.have.deep.property('[0].username');
          done();

        });

    });

    it('should delete a user', function (done) {

      request(server.app)
        .delete(route + '/' + username)
        .expect('Content-Type', /json/)
        .expect(201)
        .end(function (err, res) {

          expect(res.body).to.have.property('username', username);

          User.findOne({username: username})
            .then(function (user) {

              expect(user).to.be.null;
              done();

            });

        });

    });

  });

});