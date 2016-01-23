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
          expect(res.body[0].username).to.equal('Alejandro');
          expect(res.body[1].username).to.equal('Bob');
          expect(res.body[2].username).to.equal('Susan');
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
          expect(res.body[0].username).to.equal('Bob');
          expect(res.body[1].username).to.equal('Susan');
          expect(res.body[2].username).to.equal('Alejandro');
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
          expect(res.body[0].username).to.equal('Susan');
          expect(res.body[1].username).to.equal('Bob');
          expect(res.body[2].username).to.equal('Alejandro');
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
          expect(res.body[0].title).to.equal('Take Codecademy\'s Intro Course');
          expect(res.body[1].title).to.equal('Watch Life On Mars?');
          expect(res.body[2].title).to.equal('Watch Straight Outta Compton');
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
          expect(res.body[0].title).to.equal('Watch Straight Outta Compton');
          expect(res.body[1].title).to.equal('Take Codecademy\'s Intro Course');
          expect(res.body[2].title).to.equal('Watch Life On Mars?');
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
        .query({username: 'Bob'})
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
          expect(res.body).to.not.be.empty;          
          expect(res.body[0].username).to.equal('Bob');
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

    it('should filter roadmaps by title', function (done) {

      request(server.app)
        .get(route.maps)
        .query({title: 'Take Codecademy\'s Intro Course'})
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
          expect(res.body).to.not.be.empty;          
          expect(res.body[0].title).to.equal('Take Codecademy\'s Intro Course');        
          done();
        });

    });

  });

});