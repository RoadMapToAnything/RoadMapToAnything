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
  
  /* * * * * * * * * * * * * * * * * * * * * 
   *            AUTHENTICATION             *
   * * * * * * * * * * * * * * * * * * * * */

  describe('Authentication', function() {
    var username = 'iAmATest';
    var password = 'shhh';

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


  /* * * * * * * * * * * * * * * * * * * * * 
   *              /api/users               *
   * * * * * * * * * * * * * * * * * * * * */

  describe('Fetching Users', function() {
    var username = 'bowieloverx950';

    after(function(done) {
      User.findOneAndUpdate({username: username}, {firstName: 'Bob'})
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

          expect(res.body).to.be.an('array');
          expect(res.body).to.not.be.empty;
          expect(res.body[0]).to.have.property('username', username);
          expect(res.body[0].roadmaps).to.be.an('array');
          expect(res.body[0].roadmaps).to.not.be.empty;
          expect(res.body[0].roadmaps[0]).to.have.property('title');
          done();

        });

    });

    it('should retrieve a specific user with name properties, timestamps, and populated roadmaps', function (done) {

      request(server.app)
        .get(route + '/' + username)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {

          expect(res.body).to.have.property('username', username);
          expect(res.body).to.have.property('firstName', 'Bob');
          expect(res.body).to.have.property('lastName', 'Johnson');
          expect(res.body).to.have.property('created');
          expect(res.body).to.have.property('updated');
          expect(res.body).to.have.property('roadmaps');
          expect(res.body.roadmaps).to.be.an('array');
          expect(res.body.roadmaps).to.not.be.empty;
          expect(res.body.roadmaps[0]).to.have.property('title');

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

  });

});