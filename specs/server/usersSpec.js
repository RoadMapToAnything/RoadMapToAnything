process.env.NODE_ENV = 'test'; // disable morgan

var expect = require('chai').expect,
    request = require('supertest'),
    testData = require('./testData.js'),
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
  var user = testData.users[0];
  var username = user.username;
  var password = user.password;


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
   *              /api/users               *
   * * * * * * * * * * * * * * * * * * * * */

  describe('Fetching Users', function() {

    before(function(done) {
      testData.seedUsers(done);
    });

    after(function(done) {
      testData.clearUsers(done);
    });

    it('should retrieve an array of users with populated roadmaps', function (done) {

      request(server.app)
        .get(route)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {

          expect(res.body).to.be.an('array');
          expect(res.body).to.not.be.empty;
          expect(res.body[0]).to.have.property('username', username);
          expect(res.body[0].roadmaps).to.be.an('array');
          expect(res.body[0].roadmaps).to.not.be.empty;
          expect(res.body[0].roadmaps[0]).to.have.property('title');
          done();

        });

    });

    it('should retrieve a specific user with name properties, and timestamps', function (done) {

      request(server.app)
        .get(route + '/' + username)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {

          expect(res.body).to.have.property('username', username);
          expect(res.body).to.have.property('firstName', user.firstName);
          expect(res.body).to.have.property('lastName', user.lastName);
          expect(res.body).to.have.property('created');
          expect(res.body).to.have.property('updated');

          // Timestamps must be wrapped in order to ensure a consistent format.
          expect( new Date(res.body.created).getTime() ).to.equal( new Date(res.body.updated).getTime() );
          done();

        });

    });


    it('should update a user with new first name and timestamps', function (done) {
      User.findOne({username: username})
        .then(function (user) {
          var preUpdateStamp = user.updated;

          request(server.app)
            .put(route + '/' + username)
            .send({firstName: 'Robert'})
            .expect('Content-Type', /json/)
            .expect(201)
            .end(function (err, res) {

              expect(res.body).to.have.property('username', username);
              User.findOne({username: username})
                .then(function (user) {

                  expect(user).to.have.property('firstName', 'Robert');
                  expect(user.created).to.not.equal(user.updated);

                  // Timestamps must be wrapped in order to ensure a consistent format.
                  expect( new Date(user.updated).getTime() ).to.not.equal( new Date(preUpdateStamp).getTime() );
                  done();
                });

            });

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