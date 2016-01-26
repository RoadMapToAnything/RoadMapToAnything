process.env.NODE_ENV = 'test'; // disable morgan

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
        .catch(function(err){ throw err; });
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

    it('If no new Roadmaps exist, response array should be three', function(done){
      Roadmap.findOneAndRemove({title: 'TestMap'})
        .then(function(){
          request(server.app)
            .get('/api/roadmaps')
            .end(function(err, serverResponse){
              if (err) throw err;
              result = serverResponse.body;
              expect( result.length ).to.equal(3);
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
        .catch(function(err){ throw err; });
    });

    it('Should respond with the Roadmap specified by ID, with timestamps', function(done){
     
      request(server.app)
        .get('/api/roadmaps/'+testMapID)
        .end(function(err, serverResponse){
          if (err) throw err;
          expect( serverResponse.body._id ).to.equal( String(testMapID) );
          expect(serverResponse.body).to.have.property('created');
          expect(serverResponse.body).to.have.property('updated');

          // Timestamps must be wrapped in order to ensure a consistent format.
          expect( serverResponse.body.created ).to.equal( serverResponse.body.updated );
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

    it('Should update specified field on Roadmap with provided value and update timestamp', function(done){
      Roadmap.findOne({_id: testMapID})
        .then(function (map) {
          var preUpdateStamp = map.updated;

          request(server.app)
            .put('/api/roadmaps/'+testMapID)
            .send({description: "Learn JavaScript"})
            .end(function(err, serverResponse){
              if (err) throw err;

              Roadmap.findById(testMapID)
                .then(function(dbResults){
                  expect( dbResults.description ).to.equal( "Learn JavaScript" );
                  expect(dbResults.created).to.not.equal(dbResults.updated);

                  // Timestamps must be wrapped in order to ensure a consistent format.
                  expect( new Date(dbResults.updated).getTime() ).to.not.equal( new Date(preUpdateStamp).getTime() );
                  done();
                });
            });
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