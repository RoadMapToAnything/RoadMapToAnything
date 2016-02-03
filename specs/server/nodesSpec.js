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

    it('Should respond with 400 when creating a new Node with an invalid parentRoadmap', function(done){
      var correctParent = newNode.parentRoadmap;
      newNode.parentRoadmap = 'f00000000000000000000000'
      
      request(server.app)
        .post('/api/nodes')
        .set('Authorization', header)
        .send(newNode)
        .expect(400)
        .end(function(err, result){
          if (err) throw err;
          newNode.parentRoadmap = correctParent;
          done();
        });
    });

    it('Should respond with 401 when attempting to create a new Node without logging in', function(done){
      request(server.app)
        .post('/api/nodes')
        .send(newNode)
        .expect(401)
        .end(done);
    });

    it('Should respond with 403 when attempting to create a new Node on another user\'s Roadmap', function(done){
      var correctParent = newNode.parentRoadmap;
      newNode.parentRoadmap = '000000000000000000000010'

      request(server.app)
        .post('/api/nodes')
        .set('Authorization', header)
        .send(newNode)
        .expect(403)
        .end(function(err, result){
          if (err) throw err;
          newNode.parentRoadmap = correctParent;
          done();
        });
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
      Node.findOneAndRemove({_id: newNode._id})
      .then(function() { 
        return Roadmap.findOneAndRemove({title: newMap.title});
      })
      .then(function(){ done(); })
      .catch(function(err){ throw err; });
    });

    it('Should update only modifiable fields on Node, and should update timestamp', function(done){
      Node.findOne({_id: newNode._id})
      .then(function (node) {
        var timestamp = node.updated;

        var update = {
          title         : 'should change',
          description   : 'should change',
          resourceType  : 'should change',
          resourceURL   : 'should change',
          imageUrl      : 'should change',
          parentRoadmap : 'should not change',
          created       : 'should not change',
          updated       : 'should not change'    
        };

        request(server.app)
          .put('/api/nodes/' + newNode._id)
          .set('Authorization', header)
          .send(update)
          .end(function (err, res) {
            if (err) throw err;
  
              Node.findById(newNode._id)
              .then(function(dbResults){

                expect( dbResults.title       ).to.equal( 'should change' );
                expect( dbResults.description ).to.equal( 'should change' );
                expect( dbResults.resourceType).to.equal( 'should change' );
                expect( dbResults.resourceURL ).to.equal( 'should change' );
                expect( dbResults.imageUrl    ).to.equal( 'should change' );
                
                expect( dbResults.parentRoadmap ).to.not.equal( 'should not change' );
                expect( dbResults.created       ).to.not.equal( 'should not change' );
                expect( dbResults.updated       ).to.not.equal( 'should not change' );
  
                // Timestamps must be wrapped in order to ensure a consistent format.
                expect( new Date(dbResults.updated).getTime() ).to.not.equal( new Date(timestamp).getTime() );
                done();
              });
          });
      });
    });

    
    it('Should respond with 401 when attempting to update a Node without logging in', function(done){
      request(server.app)
        .put('/api/nodes/'+newNode._id)
        .send({})
        .expect(401)
        .end(done);
    });

    it('Should respond with 403 when attempting to update a Node on another user\'s Roadmap', function(done){
      request(server.app)
        .put('/api/nodes/'+ data.nodes[0]._id)
        .set('Authorization', header)
        .send({})
        .expect(403)
        .end(done);
    });


  });

  /* * * * * * * * * * * * * * * * * * * * * 
   *    PUT /api/nodes/:nodeID/complete    *
   * * * * * * * * * * * * * * * * * * * * */

  describe('PUT /api/nodes/:nodeID/complete', function(){

    var User = require('../../server/api/users/userModel.js');
    var tempUser = {username: 'temp', password: 'pass'}
    var tempHeader;

    before('Create a new test User', function(done) {
      request(server.app)
        .post('/api/signup')
        .send(tempUser)
        .expect(201)
        .end(function (err, res) {
          if (err) throw err;
          tempHeader = 'Basic ' + btoa(res.body.data.username + ':' + res.body.data.authToken);
          done();
        })
    });

    after('Remove the test User', function(done) {
      User.findOneAndRemove({username: tempUser.username})
        .then(function(){ done(); })
        .catch(function(err){ throw err; });
    });

    it('Should add Node to user\'s inProgress.nodes array', function(done){

      request(server.app)
        .put('/api/nodes/' + testNode._id + '/complete')
        .set('Authorization', tempHeader)
        .expect(200)
        .end(function (err, res) {
          if (err) throw err;
          User.findOne({username: tempUser.username})
            .then(function(user){
              expect(user.inProgress.nodes).to.include(testNode._id);
              done();
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

    it('Should respond with 401 when attempting to delete a Node without logging in', function(done){
      request(server.app)
        .delete('/api/nodes/' + newNode._id)
        .expect(401)
        .end(done);
    });

    it('Should respond with 403 when attempting to delete a Node on a Roadmap authored by another user', function(done){
      request(server.app)
        .delete('/api/nodes/' + data.nodes[0]._id)
        .set('Authorization', header)
        .expect(403)
        .end(done);
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