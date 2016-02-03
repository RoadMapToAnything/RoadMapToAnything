// process.env.NODE_ENV = 'test'; // Test mode: switches port, db, and morgan off

var request  = require('supertest'),
    expect   = require('chai').expect,
    btoa     = require('btoa'),

    server   = require('../../server/server.js'),
    Roadmap  = require('../../server/api/roadmaps/roadmapModel.js'),

    data     = require('../data/testData.json'),
    testUser = data.users[0],
    testMap  = data.maps[0],
    newUser  = data.newUser,
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
      result, 
      header;


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
      newMap.author = '000000000000000000000001';
      Roadmap(newMap)
      .save()
      .then(function (savedRoadmap){
        newMap._id = savedRoadmap._id;
        done();
      });
    });

    after('Remove test Roadmap', function(done) {
      newMap.author = '00000000000000000000000f';
      Roadmap.findOneAndRemove({_id: newMap._id})
      .then(function(){ done(); })
      .catch(function(err){ throw err; });
    });

    it('Should respond with 401 when no Authorization header is provided', function (done){
      request(server.app)
      .put('/api/roadmaps/' + newMap._id)
      .expect(401)
      .end(done);
    });   

    it('Should respond with 403 when attempting to update other user\'s Roadmaps', function (done){
      request(server.app)
      .put('/api/roadmaps/' + data.maps[1]._id)
      .set('Authorization', header)
      .expect(403)
      .end(done);
    }); 

    it('Should update only modifiable fields on Roadmap, and should update timestamp', function(done){
      Roadmap.findOne({_id: newMap._id})
      .then(function (map) {
        var preUpdateStamp = map.updated;

        var update = {
          title: 'should change',
          description: newMap.description, 
          author:  'should not change',
          nodes:   'should not change',
          created: 'should not change',
          updated: 'should not change',
        }

        request(server.app)
        .put('/api/roadmaps/' + newMap._id)
        .set('Authorization', header)
        .send(update)
        .end(function(err, res){
          if (err) throw err;

          Roadmap.findById(newMap._id)
          .then(function (dbResults) {
            expect( dbResults.created ).to.not.equal( dbResults.updated );

            expect( dbResults.title ).to.equal( 'should change' );
            expect( dbResults.description ).to.equal( newMap.description );

            expect( dbResults.author  ).to.not.equal( 'should not change' );
            expect( dbResults.nodes   ).to.not.equal( 'should not change' );
            expect( dbResults.created ).to.not.equal( 'should not change' );
            expect( dbResults.updated ).to.not.equal( 'should not change' );

            // Timestamps must be wrapped in order to ensure a consistent format.
            expect( new Date(dbResults.updated).getTime() ).to.not.equal( new Date(preUpdateStamp).getTime() );
            done();
          });
        });
      });
    });
  });


/* * * * * * * * * * * * * * * * * * * * * * * * *
 *      PUT /api/roadmaps/:roadmapID/:action     *
 * * * * * * * * * * * * * * * * * * * * * * * * */

  describe('PUT /api/roadmaps/:roadmapID/:action', function(){

    var User = require('../../server/api/users/userModel.js');
    var tempHeader;

    before('Create a new test User', function(done) {
      request(server.app)
        .post('/api/signup')
        .send(newUser)
        .end(function (err, res) {
          if (err) throw err;
          tempHeader = 'Basic ' + btoa(res.body.data.username + ':' + res.body.data.authToken);
          done();
        })
    });

    after('Remove the test User', function(done) {
      User.findOneAndRemove({username: newUser.username})
        .then(function(){ done(); })
        .catch(function(err){ throw err; });
    });

    it('Should add Roadmap to user\'s inProgress.roadmaps array when :action is follow', function(done){
      request(server.app)
        .put('/api/roadmaps/' + testMap._id + '/follow')
        .set('Authorization', tempHeader)
        .expect(200)
        .end(function (err, res) {
          if (err) throw err;
          User.findOne({username: newUser.username})
            .then(function(user){
              expect(user.inProgress.roadmaps).to.include(testMap._id);
              done();
            });
        });
    });

    it('Should remove Roadmap from user\'s inProgress.roadmaps array when :action is unfollow', function(done){
      request(server.app)
        .put('/api/roadmaps/' + testMap._id + '/unfollow')
        .set('Authorization', tempHeader)
        .expect(200)
        .end(function (err, res) {
          if (err) throw err;
          User.findOne({username: newUser.username})
            .then(function(user){
              expect(user.inProgress.roadmaps).to.not.include(testMap._id);
              done();
            });
        });
    });

    it('Should add Roadmap to user\'s completedRoadmaps array when :action is complete', function(done){

      request(server.app)
        .put('/api/roadmaps/' + testMap._id + '/follow')
        .set('Authorization', tempHeader)
        .expect(200)
        .end(function (err, res) {
          if (err) throw err;
          
          User.findOne({username: newUser.username})
            .then(function(user){

              expect(user.inProgress.roadmaps).to.include(testMap._id);

              request(server.app)
                .put('/api/roadmaps/' + testMap._id + '/complete')
                .set('Authorization', tempHeader)
                .expect(200)
                .end(function (err, res) {
                  if (err) throw err;
                  User.findOne({username: newUser.username})
                    .then(function(user){
                      expect(user.inProgress.roadmaps).to.not.include(testMap._id);
                      expect(user.completedRoadmaps).to.include(testMap._id);
                      done();
                    });
                });
            });
        });
    });

      it('Should upvote a roadmap when :action is upvote', function(done){

      request(server.app)
        .put('/api/roadmaps/' + testMap._id + '/upvote')
        .set('Authorization', tempHeader)
        .expect(200)
        .end(function (err, res) {
          if (err) throw err;
          
          Roadmap.findById(testMap._id)
            .then(function(roadmap){

              expect(roadmap.upvotes).to.include(newUser._id);
              expect(roadmap.downvotes).to.not.include(newUser._id);
              done();
            });
        });
    });

    it('Should downvote a roadmap when :action is downvote', function(done){

    request(server.app)
      .put('/api/roadmaps/' + testMap._id + '/downvote')
      .set('Authorization', tempHeader)
      .expect(200)
      .end(function (err, res) {
        if (err) throw err;
        
        Roadmap.findById(testMap._id)
          .then(function(roadmap){

            expect(roadmap.downvotes).to.include(newUser._id);
            expect(roadmap.upvotes).to.not.include(newUser._id);
            done();
          });
      });
    });


  });

  /* * * * * * * * * * * * * * * * * * * * * 
   *   DELETE /api/roadmaps/:roadmapID     *
   * * * * * * * * * * * * * * * * * * * * */

  describe('DELETE /api/roadmaps/:roadmapID', function(){

    before('Create test Roadmap', function(done) {
      newMap.author = '000000000000000000000001';
      Roadmap(newMap)
      .save()
      .then(function (savedRoadmap){
        newMap._id = savedRoadmap._id;
        done();
      });
    });

    after('Ensure test Roadmap is removed', function (done) {
      newMap.author = '00000000000000000000000f';
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

    it('Should respond with 403 when attempting to delete other user\'s Roadmaps', function (done){
      request(server.app)
      .delete('/api/roadmaps/' + data.maps[1]._id)
      .set('Authorization', header)
      .expect(403)
      .end(done);
    });

    it('Should delete the Roadmap specified by ID', function(done){
      request(server.app)
      .delete('/api/roadmaps/' + newMap._id)
      .set('Authorization', header)
      .expect(200)
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