var request  = require('supertest'),
    expect   = require('chai').expect,

    server   = require('../../server/server.js'),
    Node     = require('../../server/api/nodes/nodeModel.js');


/* * * * * * * * * * * * * * * * * * * * * * * */
/* * * * * * * * * * * * * * * * * * * * * * * */
/* * * * *       NODE ROUTES           * * * * */
/* * * * *       /api/nodes            * * * * */
/* * * * * * * * * * * * * * * * * * * * * * * */
/* * * * * * * * * * * * * * * * * * * * * * * */

describe('Node Routes - /api/nodes', function() {
  
  var result;

  var testNode = { 
    title        : 'TestNode',
    description  : 'Learn TDD',
    resourceType : 'link',
    resourceURL  : 'https://en.wikipedia.org/wiki/Test-driven_development',
    parentRoadmap: '???'
  };


  /* * * * * * * * * * * * * * * * * * * * * 
  *    POST /api/nodes/                    *
  * * * * * * * * * * * * * * * * * * * * */

  describe('POST /api/nodes', function(){

    after('Remove test Node', function(done) {
      Node.findOneAndRemove({title: 'TestNode'})
        .then(function(){ done(); })
        .catch(function(err){ throw err; })
    });

    it('Should respond with 201 when creating a new Node', function(done){
      request(server.app)
        .post('/api/nodes')
        .send(testNode)
        .expect(201)
        .end(done);
    });
  });

  /* * * * * * * * * * * * * * * * * * * * * 
  *    POST /roadmaps/:roadmapID/nodes     *
  * * * * * * * * * * * * * * * * * * * * */


  /* * * * * * * * * * * * * * * * * * * * * 
  *    GET /api/nodes/                     *
  * * * * * * * * * * * * * * * * * * * * */

  /* * * * * * * * * * * * * * * * * * * * * 
  *    GET /api/nodes/:nodeID              *
  * * * * * * * * * * * * * * * * * * * * */


  /* * * * * * * * * * * * * * * * * * * * * 
  *    PUT /api/nodes/:nodeID              *
  * * * * * * * * * * * * * * * * * * * * */

  /* * * * * * * * * * * * * * * * * * * * * 
  *    DELETE /api/nodes/:nodeID           *
  * * * * * * * * * * * * * * * * * * * * */


};