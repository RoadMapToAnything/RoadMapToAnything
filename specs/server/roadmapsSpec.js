var request  = require('supertest'),
    expect   = require('chai').expect,

    server   = require('../../server/server.js'),
    Roadmap  = require('../../server/api/roadmaps/roadmapModel.js');



describe('/api/roadmaps routes', function() {
  
  var result;

  var testMap = { 
    title      : 'TestMap',
    description: 'Learn TDD',
    author     : '56a04c964c984dbc4f2544d7',
    nodes      : []
  };

  describe('POST /api/roadmaps', function(){

    after('Remove test roadmap', function(done) {
      Roadmap.find({title: 'TestMap'})
      .remove(function(err, dbResults){
        done();
      });
    });

    it('Should respond with 201 when creating a new roadmap', function(done){
      request(server.app)
        .post('/api/roadmaps')
        .send(testMap)
        .expect(201)
        .end(done);
    });
  });

  // describe('GET /api/roadmaps', function(){

  //   before('Create test roadmap', function(done) {
  //     Roadmap(testMap)
  //       .save()
  //       .then(function(){
  //         request(server.app)
  //           .get('/api/roadmaps')
  //           .end(function(err, serverResponse){
  //             if (err) throw err;
  //             result = serverResponse.body;
  //             done();
  //           });
  //       });
  //   });

  //   after('Remove test roadmap', function(done) {
  //     Roadmap.find({title: 'TestMap'})
  //     .remove(function(err, dbResults){
  //       done();
  //     });
  //   });

  //   it('Should respond with an array', function(done){
  //     expect( Array.isArray(result) ).to.be(true);
  //   });

  //   it('If Roadmaps exist, response array should contain Roadmaps', function(done){
  //     expect( result[0].hasOwnProperty('nodes') ).to.be(true);
  //   });

  //   it('If no Roadmaps exist, response array should be empty', function(done){
  //     Roadmap.find({title: 'TestMap'})
  //       .remove()
  //       .then(function(){
  //         request(server.app)
  //           .get('/api/roadmaps')
  //           .end(function(err, serverResponse){
  //             if (err) throw err;
  //             result = serverResponse.body;
  //             expect( result[0].hasOwnProperty('nodes') ).to.be(true);
  //           });
  //       });
  //   });


  // });


});












  /*

post(  '/roadmaps'
get(   '/roadmaps'
get(   '/roadmaps/:roadmapID
put(   '/roadmaps/:roadmapID
delete('/roadmaps/:roadmapID'



  title      : { type: String,   required: true },
  description: { type: String,   required: true },
  author     : { type: ObjectId, required: true, ref: 'User' },
  nodes      : [ { type: ObjectId, ref: 'Node'} ],
  created    : { type: Date, default: Date.now}

  */