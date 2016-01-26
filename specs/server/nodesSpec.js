process.env.NODE_ENV = 'test'; // disable morgan

var request  = require('supertest'),
    expect   = require('chai').expect,

    server   = require('../../server/server.js'),
    Node     = require('../../server/api/nodes/nodeModel.js'),
    Roadmap  = require('../../server/api/roadmaps/roadmapModel.js');



/* * * * * * * * * * * * * * * * * * * * * * * */
/* * * * * * * * * * * * * * * * * * * * * * * */
/* * * * *       NODE ROUTES           * * * * */
/* * * * *       /api/nodes            * * * * */
/* * * * * * * * * * * * * * * * * * * * * * * */
/* * * * * * * * * * * * * * * * * * * * * * * */

describe('Node Routes - /api/nodes', function() {
  
  var testMap = { 
    title      : 'TestMap',
    description: 'Learn TDD',
    author     : '56a04c964c984dbc4f2544d7',
    nodes      : []
  };

  var testNode = { 
    title        : 'TestNode',
    description  : 'Learn TDD',
    resourceType : 'link',
    resourceURL  : 'https://en.wikipedia.org/wiki/Test-driven_development',
    parentRoadmap: null
  };


  /* * * * * * * * * * * * * * * * * * * * * 
  *    POST /api/nodes/                    *
  * * * * * * * * * * * * * * * * * * * * */

  describe('POST /api/nodes', function(){

    var testMapID;

    before('Create test Roadmap', function(done) {
      Roadmap(testMap)
        .save()
        .then(function(dbResults){
          testMapID = dbResults._id;
          done();
        })
        .catch(function(err){ throw err; })
    });

    after('Remove test Roadmap and Node', function(done) {
      Node.findOneAndRemove({title: 'TestNode'})
        .then(function(){ 
          return Roadmap.findOneAndRemove({title: 'TestMap'})
        })
        .then(function(){ 
          delete testNode.parentRoadmap; // reset to original state
          done(); 
        })
        .catch(function(err){ throw err; })
    });

    it('Should respond with 201 when creating a new Node', function(done){
      testNode.parentRoadmap = testMapID;

      request(server.app)
        .post('/api/nodes')
        .send(testNode)
        .expect(201)
        .end(done)
    });
  });


  /* * * * * * * * * * * * * * * * * * * * * 
  *    POST /roadmaps/:roadmapID/nodes     *
  * * * * * * * * * * * * * * * * * * * * */

  describe('POST /api/roadmaps/:roadmapID/nodes', function(){

    var testMapID;

    before('Create test Roadmap', function(done) {
      Roadmap(testMap)
        .save()
        .then(function(dbResults){
          testMapID = dbResults._id;
          done();
        })
        .catch(function(err){ throw err; })
    });

    after('Remove test Roadmap and Node', function(done) {
      Node.findOneAndRemove({title: 'TestNode'})
        .then(function(){ 
          return Roadmap.findOneAndRemove({title: 'TestMap'})
        })
        .then(function(){ done(); })
        .catch(function(err){ throw err; })
    });

    it('Should respond with 201 when creating a new Node', function(done){

      request(server.app)
        .post('/api/roadmaps/'+testMapID+'/nodes')
        .send(testNode)
        .expect(201)
        .end(done);
    });
  });


  /* * * * * * * * * * * * * * * * * * * * * 
  *    GET /api/nodes/:nodeID              *
  * * * * * * * * * * * * * * * * * * * * */

  describe('GET /api/nodes/:nodeID', function(){
   
    var testNodeID;

    before('Create test Roadmap and Node', function(done) {
      Roadmap(testMap)
        .save()
        .then(function(savedRoadmap){
          testNode.parentRoadmap = savedRoadmap._id;
          return Node(testNode).save();
        })
        .then(function(savedNode){
          testNodeID = savedNode._id;
          done();
        })
        .catch(function(err){ throw err; });
    });

    after('Remove test Roadmap and Node', function(done) {
      Node.findOneAndRemove({title: 'TestNode'})
        .then(function(){ 
          return Roadmap.findOneAndRemove({title: 'TestMap'});
        })
        .then(function(){ done(); })
        .catch(function(err){ throw err; });
    });

    it('Should respond with the Node specified by ID, with timestamps', function(done){
     
      request(server.app)
        .get('/api/nodes/'+testNodeID)
        .end(function(err, serverResponse){
          if (err) throw err;
          expect( serverResponse.body._id ).to.equal( String(testNodeID) );
          expect( serverResponse.body ).to.have.property('created');
          expect( serverResponse.body ).to.have.property('updated');

          // Timestamps must be wrapped in order to ensure a consistent format.
          expect( serverResponse.body.created ).to.equal( serverResponse.body.updated );
          done();
        });

    });

  });


  /* * * * * * * * * * * * * * * * * * * * * 
  *    PUT /api/nodes/:nodeID              *
  * * * * * * * * * * * * * * * * * * * * */

  describe('PUT /api/nodes/:nodeID', function(){
   
    var testNodeID;

    before('Create test Roadmap and Node', function(done) {
      Roadmap(testMap)
        .save()
        .then(function(savedRoadmap){
          testNode.parentRoadmap = savedRoadmap._id;
          return Node(testNode).save();
        })
        .then(function(savedNode){
          testNodeID = savedNode._id;
          done();
        })
        .catch(function(err){ throw err; })
    });

    after('Remove test Roadmap and Node', function(done) {
      Node.findOneAndRemove({title: 'TestNode'})
        .then(function(){ 
          return Roadmap.findOneAndRemove({title: 'TestMap'})
        })
        .then(function(){ done(); })
        .catch(function(err){ throw err; })
    });

    xit('Should update specified field on Node with provided value, with updated timestamps', function(done){
      Node.findOne({_id: testNodeID})
        .then(function (node) {
          var preUpdateStamp = node.updated;

          request(server.app)
            .put('/api/nodes/'+testNodeID)
            .send({description: 'Updated Description'})
            .end(function(err, serverResponse){
              if (err) throw err;

              Node.findById(testNodeID)
                .then(function(dbResults){
                  expect( dbResults.description ).to.equal( 'Updated Description' );
                  expect( dbResults.created ).to.not.equal( dbResults.updated );

                  // Timestamps must be wrapped in order to ensure a consistent format.
                  expect( new Date(dbResults.updated).getTime() ).to.not.equal( new Date(preUpdateStamp).getTime() );
                  done();
                });
            });
        });
    });

  });


  /* * * * * * * * * * * * * * * * * * * * * 
  *    DELETE /api/nodes/:nodeID           *
  * * * * * * * * * * * * * * * * * * * * */

  describe('DELETE /api/nodes/:nodeID', function(){
   
    var testNodeID;

    before('Create test Roadmap and Node', function(done) {
      Roadmap(testMap)
        .save()
        .then(function(savedRoadmap){
          testNode.parentRoadmap = savedRoadmap._id;
          return Node(testNode).save();
        })
        .then(function(savedNode){
          testNodeID = savedNode._id;
          done();
        })
        .catch(function(err){ throw err; })
    });

    after('Remove test Roadmap and Node', function(done) {
      Node.findOneAndRemove({title: 'TestNode'})
        .then(function(){ 
          return Roadmap.findOneAndRemove({title: 'TestMap'})
        })
        .then(function(){ done(); })
        .catch(function(err){ throw err; })
    });

    it('Should delete the Node specified by ID', function(done){
      request(server.app)
        .delete('/api/nodes/'+testNodeID)
        .end(function(err, serverResponse){
          if (err) throw err;

          Node.findById(testNodeID)
            .then(function(dbResults){
              expect( dbResults ).to.equal( null );
              done();
            });
        });
    });

  });







});