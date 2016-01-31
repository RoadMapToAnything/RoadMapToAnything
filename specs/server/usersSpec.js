process.env.NODE_ENV = 'test'; // Test mode: switches port, db, and morgan off

var expect = require('chai').expect,
    request = require('supertest'),
    btoa = require('btoa'),

    User = require('../../server/api/users/userModel.js'),
    data = require('../data/testData.json'),
    testUser = data.users[0],
    testMap = data.maps[0],
    testNode = data.nodes[0],
    newUser = data.newUser,

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
    var name = newUser.username;
    var pass = newUser.password;

    it('Should signup a new user', function (done) {

      request(server.app)
      .post('/api/signup')
      .send(newUser)
      .expect('Content-Type', /json/)
      .expect(201)
      .end(function (err, res) {
        expect(res.body.data).to.have.property('username', name);
        expect(res.body.data).to.have.property('authToken');
        newUser.authToken = res.body.data.authToken;

        User.findOne({username: name})
        .then(function (user) {

          expect(user).to.have.property('username', name);
          done();

        });
        
      });

    });

    it('Should be able to log in', function (done) {

      request(server.app)
      .get('/api/login')
      .query({username: name, password: pass})
      .expect('Content-Type', /json/)
      .expect(201)
      .end(function (err, res) {

        expect(res.body.data).to.have.property('username', name);
        expect(res.body.data).to.have.property('authToken');
        done();

      });

    });

    it('Should delete a user', function (done) {
      var header = btoa('Basic ' + name + newUser.authToken);

      request(server.app)
      .delete(route + '/' + name)
      .set('Authorization', header)
      .expect('Content-Type', /json/)
      .expect(201)
      .end(function (err, res) {

        expect(res.body.data).to.have.property('username', name);

        User.findOne({username: name})
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

  describe('Fetching A Group of Users', function() {
    var users;

    before(function(done) {
      request(server.app)
      .get(route)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        users = res.body.data;
        done();

      });
    });

    it('Should return an array of users', function() {
      expect(users).to.be.an('array');
      expect(users).to.not.be.empty;
      expect(users[0]).to.have.property('username', testUser.username);
    });

    it('Should have a populated authored roadmaps array', function() {
      var maps = users[0].authoredRoadmaps;

      expect(maps).to.be.an('array');
      expect(maps).to.not.be.empty;
      expect(maps[0]).to.have.property('title', testMap.title);
    });

    it('Should populate its authored roadmaps', function() {
      var nodes = users[0].authoredRoadmaps[0].nodes;

      expect(nodes).to.be.an('array');
      expect(nodes).to.not.be.empty;
      expect(nodes[0]).to.have.property('title', testNode.title);
    });

  });

  describe('Fetching a Single User', function() {
    var name = testUser.username;
    var user;

    before(function(done) {
      request(server.app)
      .get(route + '/' + name)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        user = res.body.data;
        done();
      });
    });

    it('Should retrieve a specifc user', function() {
      expect(user).to.have.property('username', name);
      expect(user).to.have.property('firstName', testUser.firstName);
      expect(user).to.have.property('lastName', testUser.lastName);
    });

    it('Should have a populated authored roadmaps array', function() {
      var maps = user.authoredRoadmaps;

      expect(maps).to.be.an('array');
      expect(maps).to.not.be.empty;
      expect(maps[0]).to.have.property('title', testMap.title);
    });

    it('Should populate its authored roadmaps', function() {
      var nodes = user.authoredRoadmaps[0].nodes;

      expect(nodes).to.be.an('array');
      expect(nodes).to.not.be.empty;
      expect(nodes[0]).to.have.property('title', testNode.title);
    });

  });

  describe('Updating a User', function() {
    var name = testUser.username;
    var timestamp, header;

    before(function (done) {
      User.findOne({username: name})
      .then(function (user) {
        timestamp = user.updated;
      })
      .then(function() {
        request(server.app)
        .get('/api/login')
        .query({username: name, password: testUser.password})
        .expect('Content-Type', /json/)
        .expect(201)
        .end(function (err, res) {
          header = btoa('Basic ' + name + res.body.data.authToken);
          done();
        });
      });
    });

    after(function (done) {
      User.findOneAndUpdate({username: name}, {firstName: testUser.firstName})
      .then(function() {
        done();
      });
    });

    it('Should update a user, updating the timestamp', function (done) {
      request(server.app)
      .put(route + '/' + name)
      .set('Authorization', header)
      .send({firstName: 'Robert'})
      .expect('Content-Type', /json/)
      .expect(201)
      .end(function (err, res) {

        expect(res.body.data).to.have.property('username', name);

        User.findOne({username: name})
        .then(function (user) {

          expect(user).to.have.property('firstName', 'Robert');
          expect(user.created).to.not.equal(user.updated);

          // Timestamps must be wrapped in order to ensure a consistent format.
          expect( new Date(user.updated).getTime() ).to.not.equal( new Date(timestamp).getTime() );
          done();
        });

      });

    });

  });

});