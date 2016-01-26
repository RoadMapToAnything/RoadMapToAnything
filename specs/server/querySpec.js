process.env.NODE_ENV = 'test'; // disable morgan

var expect = require('chai').expect,
    request = require('supertest'),

    User = require('../../server/api/users/userModel.js'),
    Roadmap = require('../../server/api/roadmaps/roadmapModel.js'),
    Node = require('../../server/api/nodes/nodeModel.js'),
    test = require('../data/testData.json'),

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

  describe('Sort parameter', function() {
    
    it('should sort users by username', function (done) {
      var testUsersSorted = test.users.slice(0).sort(function(a,b){
        return a.username.localeCompare(b.username);
      });
      var i = 0;

      request(server.app)
        .get(route.users)
        .query({sort: 'username'})
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {

          // This construct will check to ensure the test data users
          // are sorted, even if there is other data in the db.
          res.body.data.forEach(function (user) {
            for(var j = 0; j < testUsersSorted.length && i < testUsersSorted.length; j++) {
              if (user.username === testUsersSorted[i].username) {
                i++;
                break;
              }
              expect(user.username).to.not.equal(testUsersSorted[j].username);
            }
          });

          done();
        });

    });


    it('should not sort users by password', function (done) {
      var i = 0;

      request(server.app)
        .get(route.users)
        .query({sort: 'password'})
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {

          res.body.data.forEach(function (user) {
            for(var j = 0; j < test.users.length && i < test.users.length; j++) {
              if (user.username === test.users[i].username) {
                i++;
                break;
              }
              expect(user.username).to.not.equal(test.users[j].username);
            }
          });

          done();
        });

    });


    it('should sort users in descending order', function (done) {
      var testUsersSorted = test.users.slice(0).sort(function(a,b){
        return b.username.localeCompare(a.username);
      });
      var i = 0;

      request(server.app)
        .get(route.users)
        .query({sort: '-username'})
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {

          res.body.data.forEach(function (user) {
            for(var j = 0; j < testUsersSorted.length && i < testUsersSorted.length; j++) {
              if (user.username === testUsersSorted[i].username) {
                i++;
                break;
              }
              expect(user.username).to.not.equal(testUsersSorted[j].username);
            }
          });

          done();
        });

    });

    it('should sort roadmaps by title', function (done) {
      var testMapsSorted = test.maps.slice(0).sort(function(a,b){
        return a.title.localeCompare(b.title);
      });
      var i = 0;

      request(server.app)
        .get(route.maps)
        .query({sort: 'title'})
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {

          res.body.data.forEach(function (map) {
            for(var j = 0; j < testMapsSorted.length && i < testMapsSorted.length; j++) {
              if (map.title === testMapsSorted[i].title) {
                i++;
                break;
              }
              expect(map.title).to.not.equal(testMapsSorted[j].title);
            }
          });

          done();
        });
    });

    it('should sort roadmaps in reverse chronological order', function (done) {
      var i = test.maps.length - 1;

      request(server.app)
        .get(route.maps)
        .query({sort: '-created'})
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {

          res.body.data.forEach(function (map) {
            for(var j = 0; j < test.maps.length && i >= 0; j++) {
              if (map.title === test.maps[i].title) {
                i--;
                break;
              }
              expect(map.title).to.not.equal(test.maps[j].title);
            }
          });

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
          expect(res.body.data).to.not.be.empty;          
          expect(res.body.data[0].username).to.equal('bowieloverx950');
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
          expect(res.body.data).to.not.have.length(1);          
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
          expect(res.body.data).to.not.be.empty;

          // Timestamps must be wrapped in order to ensure a consistent format.
          // And mongoose loses 15-45 milliseconds somehow, so add 50 to ensure it is late enough.
          expect(new Date(res.body.data[0].created).getTime()).to.be.below(new Date(now).getTime());        
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
          expect(res.body.data).to.be.empty;       
          done();
        });

    });

  });

});