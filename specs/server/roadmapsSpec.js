// process.env.NODE_ENV = 'test'; // disable morgan

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

  var username = 'supercoder31337';
  var password = 'a';

  var authToken;

  var testMap = { 
    title      : 'TestMap',
    description: 'Learn TDD',
    author     : '56a04c964c984dbc4f2544d7',
    nodes      : []
  };

  before('Get user token for Authorization header', function(done) {

    request(server.app)
      .get('/api/login?username='+username+'&password='+password)
      .end(function(err, serverResponse){
        if (err) throw err;
        authToken = serverResponse.body.authToken;
        done();
      });


  });

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
      request(server.app)
        .get('/api/roadmaps')
        .end(function(err, res){
          if (err) throw err;
          result = res.body.data;
          done();
        });
    });


    it('Should respond with an array', function(){
      expect(result).to.be.an('array');
    });

    it('should have roadmaps in its response array', function(){
      expect( result[0].hasOwnProperty('nodes') ).to.equal(true);
    });

    it('should have roadmaps populated with an author', function(){
      expect(result[0]).to.have.property('author');
      expect(result[0].author).to.have.property('username');
    });

    it('should have roadmaps populated with nodes', function(){
      expect(result[0]).to.have.property('nodes');
      expect(result[0].nodes).to.be.an('array');
      expect(result[0].nodes[0]).to.have.property('title');
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
        .end(function(err, res){
          if (err) throw err;
          expect( res.body.data._id ).to.equal( String(testMapID) );
          expect(res.body.data).to.have.property('created');
          expect(res.body.data).to.have.property('updated');

          // Timestamps must be wrapped in order to ensure a consistent format.
          expect( res.body.data.created ).to.equal( res.body.data.updated );
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
            .end(function(err, res){
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
     
      var encodedAuthHeader = new Buffer(username+':'+authToken, 'ascii').toString('base64');

      request(server.app)
        .delete('/api/roadmaps/'+testMapID)
        .set('Authorization', 'Basic ' + encodedAuthHeader)
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