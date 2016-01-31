process.env.NODE_ENV = 'test'; // Test mode: switches port, db, and morgan off

var request  = require('supertest'),
    expect   = require('chai').expect,
    btoa = require('btoa'),

    server   = require('../../server/server.js'),
    Roadmap  = require('../../server/api/roadmaps/roadmapModel.js'),

    data     = require('../data/testData.json'),
    testUser = data.users[0],
    testMap  = data.maps[0],
    newMap   = data.newMap;


/* * * * * * * * * * * * * * * * * * * * * * * */
/* * * * * * * * * * * * * * * * * * * * * * * */
/* * * * *       ROADMAP ROUTES        * * * * */
/* * * * *       /api/roadmaps         * * * * */
/* * * * * * * * * * * * * * * * * * * * * * * */
/* * * * * * * * * * * * * * * * * * * * * * * */

describe('Roadmap Routes - /api/roadmaps', function() {
  var name = testUser.username,
      pass = testUser.password,
      result, header;


  before('Get user token for Authorization header', function (done) {

    request(server.app)
    .get('/api/login')
    .query({username: name, password: pass})
    .end(function (err, res){
      if (err) throw err;
      header = 'Basic ' + btoa(name + ':' + res.body.data.authToken);
      done();
    });
  });

  /* * * * * * * * * * * * * * * * * * * * * 
   *      POST /api/roadmaps/              *
   * * * * * * * * * * * * * * * * * * * * */

  describe('POST /api/roadmaps', function(){

    afterEach('Remove test Roadmap', function(done) {
      Roadmap.findOneAndRemove({title: newMap.title})
      .then(function(){ done(); })
      .catch(function(err){ throw err; });
    });

    it('Should respond with 401 when no Authorization header provided', function(done){
      request(server.app)
      .post('/api/roadmaps')
      .send(newMap)
      .expect(401)
      .end(done);
    });

    it('Should respond with 201 when creating a new Roadmap', function(done){
      request(server.app)
      .post('/api/roadmaps')
      .set('Authorization', header)
      .send(newMap)
      .expect(201)
      .end(done);
    });

    it('Should not use author provided in the POST request (should use name in Authorization header)', function(done){
      request(server.app)
      .post('/api/roadmaps')
      .set('Authorization', header)
      .send(newMap)
      .end(function(err, res){
        expect(res.body.data.author.toString()).to.not.equal(newMap.author);
        done();
      });
    });

  });



  /* * * * * * * * * * * * * * * * * * * * * 
   *      GET /api/roadmaps/               *
   * * * * * * * * * * * * * * * * * * * * */

  describe('GET /api/roadmaps', function(){

    before(function (done) {
      request(server.app)
      .get('/api/roadmaps')
      .end(function(err, res){
        if (err) throw err;
        result = res.body.data;
        done();
      });
    });

    it('Should respond with an array', function() {
      expect(result).to.be.an('array');
    });

    it('should have roadmaps in its response array', function() {
      expect(result[0]).to.have.property('nodes');
    });

    it('should have roadmaps populated with an author', function(){
      expect(result[0]).to.have.property('author');
      expect(result[0].author).to.have.property('username');
    });

    it('should have roadmaps populated with nodes', function() {
      expect(result[0]).to.have.property('nodes');
      expect(result[0].nodes).to.be.an('array');
      expect(result[0].nodes[0]).to.have.property('title');
    });

  });

      /* * * * * * * * * * * * * * * * * * * * * 
       *      GET /api/roadmaps/:roadmapID     *
       * * * * * * * * * * * * * * * * * * * * */

  describe('GET /api/roadmaps/:roadmapID', function(){

    before('Create test Roadmap', function (done) {
      Roadmap(newMap)
      .save()
      .then(function (savedRoadmap) {
        newMap._id = savedRoadmap._id;
        done();
      });
    });

    after('Remove test Roadmap', function (done) {
      Roadmap.findOneAndRemove({title: newMap.title})
      .then(function(){ done(); })
      .catch(function(err){ throw err; });
    });

    it('Should respond with the Roadmap specified by ID, with timestamps', function(done){
     
      request(server.app)
      .get('/api/roadmaps/' + newMap._id)
      .end(function(err, res){
        if (err) throw err;
        expect( res.body.data._id ).to.equal( newMap._id.toString() );
        expect(res.body.data).to.have.property('created');
        expect(res.body.data).to.have.property('updated');
        expect( res.body.data.created ).to.equal( res.body.data.updated );
        done();
      });
    });

  });


      /* * * * * * * * * * * * * * * * * * * * * 
       *      PUT /api/roadmaps/:roadmapID     *
       * * * * * * * * * * * * * * * * * * * * */

  describe('PUT /api/roadmaps/:roadmapID', function(){

    before('Create test Roadmap', function(done) {
      Roadmap(newMap)
      .save()
      .then(function (savedRoadmap){
        newMap._id = savedRoadmap._id;
        done();
      });
    });

    after('Remove test Roadmap', function(done) {
      Roadmap.findOneAndRemove({title: newMap.title})
      .then(function(){ done(); })
      .catch(function(err){ throw err; });
    });

    it('Should update specified field on Roadmap with provided value and update timestamp', function(done){
      Roadmap.findOne({_id: newMap._id})
      .then(function (map) {
        var preUpdateStamp = map.updated;

        request(server.app)
        .put('/api/roadmaps/' + newMap._id)
        .send({description: newMap.description})
        .end(function(err, res){
          if (err) throw err;

          Roadmap.findById(newMap._id)
          .then(function (dbResults) {
            expect( dbResults.description ).to.equal( newMap.description );
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
   *   DELETE /api/roadmaps/:roadmapID     *
   * * * * * * * * * * * * * * * * * * * * */

  describe('DELETE /api/roadmaps/:roadmapID', function(){

    before('Create test Roadmap', function(done) {
      Roadmap(newMap)
      .save()
      .then(function (savedRoadmap){
        newMap._id = savedRoadmap._id;
        done();
      });
    });

    after('Ensure test Roadmap is removed', function (done) {
      Roadmap.findOneAndRemove({title: newMap.title})
      .then(function(){ done(); })
      .catch(function(err){ throw err; })
    });

    it('Should respond with 401 when no Authorization header is provided', function (done){

      request(server.app)
      .delete('/api/roadmaps/' + newMap._id)
      .expect(401)
      .end(done);
    });

    it('Should delete the Roadmap specified by ID', function(done){

      request(server.app)
      .delete('/api/roadmaps/' + newMap._id)
      .set('Authorization', header)
      .end(function (err, serverResponse) {
        if (err) throw err;

        Roadmap.findById(newMap._id)
        .then(function (dbResults) {
          expect( dbResults ).to.equal( null );
          done();
        });
      });
    });

  });

});