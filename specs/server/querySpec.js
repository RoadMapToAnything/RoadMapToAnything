process.env.NODE_ENV = 'test'; // disable morgan

var expect = require('chai').expect,
    request = require('supertest'),

    User = require('../../server/api/users/userModel.js'),
    Roadmap = require('../../server/api/roadmaps/roadmapModel.js'),
    Node = require('../../server/api/nodes/nodeModel.js'),
    data = require('../data/testData.json'),

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


  /* * * * * * * * * * * * * * * * * * * * * 
   *                 SORT                  *
   * * * * * * * * * * * * * * * * * * * * */

  describe('Sort Parameter', function() {
    
    it('Should sort users by username', function (done) {
      var sortedUsers = data.users.slice().sort(function(a,b){
        return a.username.localeCompare(b.username);
      });

      request(server.app)
      .get(route.users)
      .query({sort: 'username'})
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        var users = res.body.data;

        for (var i = 0; i < users.length; i++) {
          expect(users[i]._id).to.equal(sortedUsers[i]._id);
        }

        done();
      });
    });

    it('Should not sort users by password', function (done) {

      request(server.app)
      .get(route.users)
      .query({sort: 'password'})
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        var users = res.body.data;

        for (var i = 0; i < users.length; i++) {
          expect(users[i]._id).to.equal(data.users[i]._id);
        }

        done();
      });
    });

    it('Should sort users in descending order', function (done) {
      var sortedUsers = data.users.slice().sort(function(a,b){
        return b.username.localeCompare(a.username);
      });

      request(server.app)
      .get(route.users)
      .query({sort: '-username'})
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        var users = res.body.data;

        for (var i = 0; i < users.length; i++) {
          expect(users[i]._id).to.equal(sortedUsers[i]._id);
        }

        done();
      });

    });

    it('Should sort roadmaps by title', function (done) {
      var sortedMaps = data.maps.slice().sort(function(a,b){
        return a.title.localeCompare(b.title);
      });

      request(server.app)
      .get(route.maps)
      .query({sort: 'title'})
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        var maps = res.body.data;

        for (var i = 0; i < maps.length; i++) {
          expect(maps[i]._id).to.equal(sortedMaps[i]._id);
        }

        done();
      });
    });

    it('Should sort roadmaps in reverse chronological order', function (done) {
      var sortedMaps = data.maps.slice().reverse();

      request(server.app)
      .get(route.maps)
      .query({sort: '-created'})
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        var maps = res.body.data;

        for (var i = 0; i < maps.length; i++) {
          expect(maps[i]._id).to.equal(sortedMaps[i]._id);
        }

        done();
      });
    });
  });


  /* * * * * * * * * * * * * * * * * * * * * 
   *               FILTER                  *
   * * * * * * * * * * * * * * * * * * * * */

  describe('Filter Parameter', function() {
    var user = data.users[0];
    var timestamp;

    before(function (done) {
      Roadmap.findOne({title: data.maps[1].title})
      .then(function (map) {
        timestamp = new Date(map.created).getTime();
        done();
      });
    });

    it('Should filter users by name', function (done) {
      var name = user.username;

      request(server.app)
      .get(route.users)
      .query({username: name})
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        expect(res.body.data).to.not.be.empty;          
        expect(res.body.data[0].username).to.equal(name);
        done();
      });
    });

    it('Should not filter users by password', function (done) {
      var pass = user.password;

      request(server.app)
      .get(route.users)
      .query({password: pass})
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        // With password hashing, this will be difficult to test,
        // but a response with many results indicates no filter
        // was done.
        expect(res.body.data).to.not.have.length(1);          
        done();
      });
    });

    it('Should find roadmaps older than a certain time', function (done) {

      request(server.app)
      .get(route.maps)
      .query({created: '<' + timestamp})
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        expect(res.body.data).to.not.be.empty;
        expect(new Date(res.body.data[0].created).getTime()).to.be.below(timestamp);        
        done();
      });
    });

    it('Should find roadmaps newer than a certain time', function (done) {

      request(server.app)
      .get(route.maps)
      .query({created: '>' + timestamp})
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        expect(res.body.data).to.not.be.empty;   
        expect(new Date(res.body.data[0].created).getTime()).to.be.above(timestamp);      
        done();
      });
    });

  });

});