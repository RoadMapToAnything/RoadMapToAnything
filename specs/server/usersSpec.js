process.env.NODE_ENV = 'test'; // Test mode: switches port, db, and morgan off

var expect = require('chai').expect,
    request = require('supertest'),

    User = require('../../server/api/users/userModel.js'),
    testUser = require('../data/testData.json').users[0],
    newUser = require('../data/testData.json').newUser,

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
  
  /* * * * * * * * * * * * * * * * * * * * * 
   *            AUTHENTICATION             *
   * * * * * * * * * * * * * * * * * * * * */

  describe('Authentication', function() {
    var username = newUser.username;
    var password = newUser.password;

    it('should signup a new user', function (done) {

      request(server.app)
      .post('/api/signup')
      .send(newUser)
      .expect('Content-Type', /json/)
      .expect(201)
      .end(function (err, res) {

        expect(res.body.data).to.have.property('username', username);
        expect(res.body.data).to.have.property('authToken');
        newUser.authToken = res.body.data.authToken;

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

        expect(res.body.data).to.have.property('username', username);
        expect(res.body.data).to.have.property('authToken');
        done();

      });

    });

    it('should delete a user', function (done) {

      request(server.app)
      .delete(route + '/' + username)
      .expect('Content-Type', /json/)
      .expect(201)
      .end(function (err, res) {

        expect(res.body.data).to.have.property('username', username);

        User.findOne({username: username})
        .then(function (user) {

          expect(user).to.be.null;
          done();

        });

      });

    });

  });


  /* * * * * * * * * * * * * * * * * * * * * 
   *              /api/users               *
   * * * * * * * * * * * * * * * * * * * * */

  describe('Fetching Users', function() {
    var username = testUser.username;

    after(function(done) {
      User.findOneAndUpdate({username: username}, {firstName: testUser.firstName})
        .then(function() {
          done();
        });
    });

    it('should retrieve an array of users with populated roadmaps', function (done) {

      request(server.app)
        .get(route)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
          console.log(res.body.data[0].completedRoadmaps);
          expect(res.body.data).to.be.an('array');
          expect(res.body.data).to.not.be.empty;
          expect(res.body.data[0]).to.have.property('username');
          expect(res.body.data[0].authoredRoadmaps).to.be.an('array');
          expect(res.body.data[0].authoredRoadmaps).to.not.be.empty;
          expect(res.body.data[0].authoredRoadmaps[0]).to.have.property('title');
          done();

        });

    });

    it('should retrieve a specific user with name properties, timestamps, and populated authoredRoadmaps', function (done) {

      request(server.app)
        .get(route + '/' + username)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {

          expect(res.body.data).to.have.property('username', username);
          expect(res.body.data).to.have.property('firstName', testUser.firstName);
          expect(res.body.data).to.have.property('lastName', testUser.lastName);
          expect(res.body.data).to.have.property('created');
          expect(res.body.data).to.have.property('updated');
          expect(res.body.data).to.have.property('authoredRoadmaps');
          expect(res.body.data.authoredRoadmaps).to.be.an('array');
          expect(res.body.data.authoredRoadmaps).to.not.be.empty;
          expect(res.body.data.authoredRoadmaps[0]).to.have.property('title');

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

              expect(res.body.data).to.have.property('username', username);
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

  });

});