process.env.NODE_ENV = 'test'; // Test mode: switches port, db, and morgan off

var request  = require('supertest'),
    expect   = require('chai').expect,
    btoa     = require('btoa'),

    server   = require('../../server/server.js'),
    User     = require('../../server/api/users/userModel.js'),
    Node     = require('../../server/api/nodes/nodeModel.js'),
    Roadmap  = require('../../server/api/roadmaps/roadmapModel.js'),

    data     = require('../data/testData.json'),
    testNode = data.nodes[0],
    newUser  = data.newUser,
    newMap   = data.newMap,
    newNode  = data.newNode;



/* * * * * * * * * * * * * * * * * * * * * * * */
/* * * * * * * * * * * * * * * * * * * * * * * */
/* * * * *       NODE ROUTES           * * * * */
/* * * * *       /api/nodes            * * * * */
/* * * * * * * * * * * * * * * * * * * * * * * */
/* * * * * * * * * * * * * * * * * * * * * * * */

describe('Node Routes - /api/nodes', function() {
  var header;

  before(function (done) {
    request(server.app)
    .post('/api/signup')
    .send(newUser)
    .expect('Content-Type', /json/)
    .expect(201)
    .end(function (err, res) {
      header = 'Basic ' + btoa(newUser.username + ':' + res.body.data.authToken);
      done();
    });
  });

  after(function (done) {
    User.findOneAndRemove({username: newUser.username})
    .then(function() {
      done();
    });
  });



 /* * * * * * * * * * * * * * * * * * * * * 
  *           POST /api/nodes/            *
  * * * * * * * * * * * * * * * * * * * * */

  describe('POST /api/nodes', function() {

    before('Create test Roadmap', function (done) {
      Roadmap(newMap)
      .save()
      .then(function (dbResults) {
        newMap._id = dbResults._id;
        done();
      })
      .catch(function(err){ throw err; });
    });

    after('Remove test Roadmap and Node', function (done) {
      Node.findOneAndRemove({title: newNode.title})
      .then(function() { 
        return Roadmap.findOneAndRemove({title: newMap.title});
      })
      .then(function() { done(); })
      .catch(function(err){ throw err; });
    });

    it('Should respond with 201 when creating a new Node', function(done){

      request(server.app)
      .post('/api/nodes')
      .set('Authorization', header)
      .send(newNode)
      .expect(201)
      .end(done);
    });
  });


  /* * * * * * * * * * * * * * * * * * * * * 
  *    POST /roadmaps/:roadmapID/nodes     *
  * * * * * * * * * * * * * * * * * * * * */

  describe('POST /api/roadmaps/:roadmapID/nodes', function() {

    before('Create test Roadmap', function (done) {
      Roadmap(newMap)
      .save()
      .then(function (dbResults) {
        newMap._id  = dbResults._id;
        done();
      })
      .catch(function(err){ throw err; });
    });

    after('Remove test Roadmap and Node', function (done) {
      Node.findOneAndRemove({title: newNode.title})
      .then(function(){ 
        return Roadmap.findOneAndRemove({title: newMap.title});
      })
      .then(function(){ done(); })
      .catch(function(err){ throw err; });
    });

    it('Should respond with 201 when creating a new Node', function (done){

      request(server.app)
        .post('/api/roadmaps/' + newMap._id + '/nodes')
        .set('Authorization', header)
        .send(newNode)
        .expect(201)
        .end(done);
    });
  });


  /* * * * * * * * * * * * * * * * * * * * * 
  *    GET /api/nodes/:nodeID              *
  * * * * * * * * * * * * * * * * * * * * */

  describe('GET /api/nodes/:nodeID', function() {

    before('Create test Roadmap and Node', function (done) {
      Roadmap(newMap)
      .save()
      .then(function (savedRoadmap) {
        newMap._id = savedRoadmap._id;
        newNode.parentRoadmap = newMap._id;
        return Node(newNode).save();
      })
      .then(function(savedNode){
        newNode._id = savedNode._id;
        done();
      })
      .catch(function(err){ throw err; });
    });

    after('Remove test Roadmap and Node', function(done) {
      Node.findOneAndRemove({title: newNode.title})
      .then(function(){ 
        return Roadmap.findOneAndRemove({title: newMap.title});
      })
      .then(function(){ done(); })
      .catch(function(err){ throw err; });
    });

    it('Should respond with the Node specified by ID, with timestamps', function(done){
     
      request(server.app)
      .get('/api/nodes/' + newNode._id)
      .end(function(err, res){
        if (err) throw err;
        expect( res.body.data._id ).to.equal( String(newNode._id) );
        expect( res.body.data ).to.have.property('created');
        expect( res.body.data ).to.have.property('updated');

        expect( res.body.data.created ).to.equal( res.body.data.updated );
        done();
      });

    });

  });

  /* * * * * * * * * * * * * * * * * * * * * 
  *           Check Population             *
  * * * * * * * * * * * * * * * * * * * * */

  describe('Check Node population', function(){

    it('should have a populated parent roadmap', function(done) {

      request(server.app)
      .get('/api/nodes/'+ testNode._id)
      .end(function (err, res) {
        if (err) throw err;
        expect( res.body.data ).to.have.property('parentRoadmap');
        expect( res.body.data.parentRoadmap ).to.have.property('title');
        done();
      });
    });

  });


  /* * * * * * * * * * * * * * * * * * * * * 
  *    PUT /api/nodes/:nodeID              *
  * * * * * * * * * * * * * * * * * * * * */

  describe('PUT /api/nodes/:nodeID', function(){

    before('Create test Roadmap and Node', function(done) {
      Roadmap(newMap)
      .save()
      .then(function(savedRoadmap){
        newMap._id = savedRoadmap._id;
        newNode.parentRoadmap = newMap._id;
        return Node(newNode).save();
      })
      .then(function(savedNode){
        newNode._id = savedNode._id;
        done();
      })
      .catch(function(err){ throw err; });
    });

    after('Remove test Roadmap and Node', function(done) {
      Node.findOneAndRemove({title: newNode.title})
      .then(function() { 
        return Roadmap.findOneAndRemove({title: newMap.title});
      })
      .then(function(){ done(); })
      .catch(function(err){ throw err; });
    });

    it('Should update specified field on Node with provided value, with updated timestamps', function(done){
      Node.findOne({_id: newNode._id})
      .then(function (node) {
        var timestamp = node.updated;

        request(server.app)
        .put('/api/nodes/' + newNode._id)
        .set('Authorization', header)
        .send({description: 'Updated Description'})
        .end(function (err, res) {
          if (err) throw err;

          Node.findById(newNode._id)
          .then(function(dbResults){
            expect( dbResults.description ).to.equal( 'Updated Description' );
            expect( dbResults.created ).to.not.equal( dbResults.updated );

            // Timestamps must be wrapped in order to ensure a consistent format.
            expect( new Date(dbResults.updated).getTime() ).to.not.equal( new Date(timestamp).getTime() );
            done();
          });
        });
      });
    });

  });


  /* * * * * * * * * * * * * * * * * * * * * 
  *    DELETE /api/nodes/:nodeID           *
  * * * * * * * * * * * * * * * * * * * * */

  describe('DELETE /api/nodes/:nodeID', function() {

    before('Create test Roadmap and Node', function (done) {
      Roadmap(newMap)
      .save()
      .then(function (savedRoadmap) {
        newMap._id = savedRoadmap._id;
        newNode.parentRoadmap = newMap._id;
        return Node(newNode).save();
      })
      .then(function (savedNode) {
        newNode._id = savedNode._id;
        done();
      })
      .catch(function(err){ throw err; });
    });

    after('Remove test Roadmap and Node', function(done) {
      Node.findOneAndRemove({title: newNode.title})
      .then(function(){ 
        return Roadmap.findOneAndRemove({title: newMap.title});
      })
      .then(function(){ done(); })
      .catch(function(err){ throw err; });
    });

    it('Should delete the Node specified by ID', function(done){
      request(server.app)
      .delete('/api/nodes/' + newNode._id)
      .set('Authorization', header)
      .end(function (err, res) {
        if (err) throw err;

        Node.findById(newNode._id)
        .then(function (dbResults) {
          expect( dbResults ).to.equal( null );
          done();
        });
      });
    });

  });

});