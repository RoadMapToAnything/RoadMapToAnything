var request  = require('supertest'),
    expect   = require('chai').expect,

    server   = require('../../server/server.js'),
    Roadmap  = require('../../server/api/roadmaps/roadmapModel.js');


/* * * * * * * * * * * * * * * * * * * * * * * */
/* * * * * * * * * * * * * * * * * * * * * * * */
/* * * * *       ROADMAP ROUTES        * * * * */
/* * * * *       /api/roadmaps         * * * * */
/* * * * * * * * * * * * * * * * * * * * * * * */
/* * * * * * * * * * * * * * * * * * * * * * * */

describe('Roadmap Routes - /api/roadmaps', function() {
  
  var result;

  var testMap = { 
    title      : 'TestMap',
    description: 'Learn TDD',
    author     : '56a04c964c984dbc4f2544d7',
    nodes      : []
  };


  /* * * * * * * * * * * * * * * * * * * * * 
   *      POST /api/roadmaps/              *
   * * * * * * * * * * * * * * * * * * * * */

  describe('POST /api/roadmaps', function(){

    after('Remove test Roadmap', function(done) {
      Roadmap.findOneAndRemove({title: 'TestMap'})
        .then(function(){ done(); })
        .catch(function(err){ throw err; })
    });

    it('Should respond with 201 when creating a new Roadmap', function(done){
      request(server.app)
        .post('/api/roadmaps')
        .send(testMap)
        .expect(201)
        .end(done);
    });
  });



  /* * * * * * * * * * * * * * * * * * * * * 
   *      GET /api/roadmaps/               *
   * * * * * * * * * * * * * * * * * * * * */

  describe('GET /api/roadmaps', function(){

    before('Create test Roadmap', function(done) {
      Roadmap(testMap)
        .save()
        .then(function(){
          request(server.app)
            .get('/api/roadmaps')
            .end(function(err, serverResponse){
              if (err) throw err;
              result = serverResponse.body;
              done();
            });
        });
    });

    after('Remove test Roadmap', function(done) {
      Roadmap.findOneAndRemove({title: 'TestMap'})
        .then(function(){ done(); })
        .catch(function(err){ throw err; })
    });

    it('Should respond with an array', function(done){
      expect( Array.isArray(result) ).to.equal(true);
      done();
    });

    it('If Roadmaps exist, response array should contain Roadmaps', function(done){
      expect( result[0].hasOwnProperty('nodes') ).to.equal(true);
      done();
    });

    it('If no Roadmaps exist, response array should be empty', function(done){
      Roadmap.findOneAndRemove({title: 'TestMap'})
        .then(function(){
          request(server.app)
            .get('/api/roadmaps')
            .end(function(err, serverResponse){
              if (err) throw err;
              result = serverResponse.body;
              expect( result.length ).to.equal(0);
              done();
            });
        });
    });

  });

      /* * * * * * * * * * * * * * * * * * * * * 
       *      GET /api/roadmaps/:roadmapID     *
       * * * * * * * * * * * * * * * * * * * * */

  describe('GET /api/roadmaps/:roadmapID', function(){
   
    var testMapID;

    before('Create test Roadmap', function(done) {
      Roadmap(testMap)
        .save()
        .then(function(savedRoadmap){
          testMapID = savedRoadmap._id;
          done();
        });
    });

    after('Remove test Roadmap', function(done) {
      Roadmap.findOneAndRemove({title: 'TestMap'})
        .then(function(){ done(); })
        .catch(function(err){ throw err; })
    });

    it('Should respond with the Roadmap specified by ID', function(done){
     
      request(server.app)
        .get('/api/roadmaps/'+testMapID)
        .end(function(err, serverResponse){
          if (err) throw err;
          expect( serverResponse.body._id ).to.equal( String(testMapID) );
          done();
        });

    });

    });


      /* * * * * * * * * * * * * * * * * * * * * 
       *      PUT /api/roadmaps/:roadmapID     *
       * * * * * * * * * * * * * * * * * * * * */

  describe('PUT /api/roadmaps/:roadmapID', function(){
   
    var testMapID;

    before('Create test Roadmap', function(done) {
      Roadmap(testMap)
        .save()
        .then(function(savedRoadmap){
          testMapID = savedRoadmap._id;
          done();
        });
    });

    after('Remove test Roadmap', function(done) {
      Roadmap.findOneAndRemove({title: 'TestMap'})
        .then(function(){ done(); })
        .catch(function(err){ throw err; })
    });

    it('Should update specified field on Roadmap with provided value', function(done){
     
      request(server.app)
        .put('/api/roadmaps/'+testMapID)
        .send({description: "Learn JavaScript"})
        .end(function(err, serverResponse){
          if (err) throw err;

          Roadmap.findById(testMapID)
            .then(function(dbResults){
              expect( dbResults.description ).to.equal( "Learn JavaScript" );
            });
          done();
        });
    });
  });

      /* * * * * * * * * * * * * * * * * * * * * 
       *   DELETE /api/roadmaps/:roadmapID     *
       * * * * * * * * * * * * * * * * * * * * */

  describe('DELETE /api/roadmaps/:roadmapID', function(){
   
    var testMapID;

    before('Create test Roadmap', function(done) {
      Roadmap(testMap)
        .save()
        .then(function(savedRoadmap){
          testMapID = savedRoadmap._id;
          done();
        });
    });

    after('Ensure test Roadmap is removed', function(done) {
      Roadmap.findOneAndRemove({title: 'TestMap'})
        .then(function(){ done(); })
        .catch(function(err){ throw err; })
    });

    it('Should delete the Roadmap specified by ID', function(done){
     
      request(server.app)
        .delete('/api/roadmaps/'+testMapID)
        .end(function(err, serverResponse){
          if (err) throw err;

          Roadmap.findById(testMapID)
            .then(function(dbResults){
              expect( dbResults ).to.equal( null );
              done();
            });
        });
    });
  });


});