process.env.NODE_ENV = 'test'; // disable morgan

var expect = require('chai').expect,
    request = require('supertest'),
    testData = require('./testData.js'),
    User = require('../../server/api/users/userModel.js'),
    Roadmap = require('../../server/api/roadmaps/roadmapModel.js'),
    Node = require('../../server/api/nodes/nodeModel.js'),

    server = require('../../server/server.js'),
    route = {
      users: '/api/users',
      maps: '/api/roadmaps',
      nodes: '/api/nodes'
    };


/* * * * * * * * * * * * * * * * * * * * * * * */
/* * * * * * * * * * * * * * * * * * * * * * * */
/* * * * *        QUERY STRINGS        * * * * */
/* * * * * * * * * * * * * * * * * * * * * * * */
/* * * * * * * * * * * * * * * * * * * * * * * */

describe('Query Strings', function() {
  var users = testData.users;

  before(function(done) {
    testData.seedData(done);
  });

  after(function(done) {
    testData.clearData(done);
  });

  /* * * * * * * * * * * * * * * * * * * * * 
   *                 SORT                  *
   * * * * * * * * * * * * * * * * * * * * */

  describe('Sort parameter', function() {


    it('should sort users by username', function (done) {

      request(server.app)
        .get(route.users)
        .query({sort: 'username'})
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
          expect(res.body[0].username).to.equal('alex<3hiphop');
          expect(res.body[1].username).to.equal('bowieloverx950');
          expect(res.body[2].username).to.equal('supercoder31337');
          done();
        });

    });


    it('should not sort users by password', function (done) {

      request(server.app)
        .get(route.users)
        .query({sort: 'password'})
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
          expect(res.body[0].username).to.equal('bowieloverx950');
          expect(res.body[1].username).to.equal('supercoder31337');
          expect(res.body[2].username).to.equal('alex<3hiphop');
          done();
        });

    });


    it('should sort users in descending order', function (done) {

      request(server.app)
        .get(route.users)
        .query({sort: '-username'})
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
          expect(res.body[0].username).to.equal('supercoder31337');
          expect(res.body[1].username).to.equal('bowieloverx950');
          expect(res.body[2].username).to.equal('alex<3hiphop');
          done();
        });

    });

    it('should sort roadmaps by title', function (done) {

      request(server.app)
        .get(route.maps)
        .query({sort: 'title'})
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
          expect(res.body[0].title).to.equal('Learning JavaScript');
          expect(res.body[1].title).to.equal('Straight Outta Knowing Nothing About Straight Outta Compton');
          expect(res.body[2].title).to.equal('Understanding Bowie');
          done();
        });
    });

    it('should sort roadmaps in reverse chronological order', function (done) {

      request(server.app)
        .get(route.maps)
        .query({sort: '-created'})
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
          console.log(res.body);
          expect(res.body[0].title).to.equal('Straight Outta Knowing Nothing About Straight Outta Compton');
          expect(res.body[1].title).to.equal('Learning JavaScript');
          expect(res.body[2].title).to.equal('Understanding Bowie');
          done();
        });
    });

  });


  /* * * * * * * * * * * * * * * * * * * * * 
   *               FILTER                  *
   * * * * * * * * * * * * * * * * * * * * */

  describe('Filter parameter', function() {

    it('should filter users by name', function (done) {

      request(server.app)
        .get(route.users)
        .query({username: 'bowieloverx950'})
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
          expect(res.body).to.not.be.empty;          
          expect(res.body[0].username).to.equal('bowieloverx950');
          done();
        });

    });


    it('should not filter users by password', function (done) {

      request(server.app)
        .get(route.users)
        .query({password: 'a'})
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
          // With password hashing, this will be difficult to test,
          // but a response with many results indicates no filter
          // was done.
          expect(res.body).to.not.have.length(1);          
          done();
        });

    });

    it('should find roadmaps older than now', function (done) {
      var now = Date.now();

      request(server.app)
        .get(route.maps)
        .query({created: '<' + now})
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
          expect(res.body).to.not.be.empty;

          // Timestamps must be wrapped in order to ensure a consistent format.
          // And mongoose loses 15-45 milliseconds somehow, so add 50 to ensure it is late enough.
          expect(new Date(res.body[0].created).getTime()).to.be.below(new Date(now).getTime());        
          done();
        });

    });

    it('should find roadmaps newer than now', function (done) {
      var now = Date.now();

      request(server.app)
        .get(route.maps)
        .query({created: '>' + now})
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
          expect(res.body).to.be.empty;       
          done();
        });

    });

  });

});