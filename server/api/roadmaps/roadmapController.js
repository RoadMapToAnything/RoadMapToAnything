var Roadmap = require('./roadmapModel.js'),
    User = require('../users/userModel.js'),
    ObjectId = require('mongoose').Types.ObjectId,
    handleError = require('../../util.js').handleError,
    handleQuery = require('../queryHandler.js'),
    getAuthHeader = require('basic-auth');
    

module.exports = {

  createRoadmap : function (req, res, next) {
    var author = getAuthHeader(req).name;
    var newRoadmap = req.body;
    console.log('API: creating roadmap');
    console.log('API: author', author);
    console.log('API: creating roadmap', newRoadmap);

    User.findOne({username: author})
      .then(function (user) {
        newRoadmap.author = user._id;
        return Roadmap(newRoadmap).save();
      })
      .then(function(dbResults){
        res.status(201).json({data: dbResults});
      })
      .catch(
        function(){
          console.log('API: error creating roadmap');
          handleError(next)
        });
  },

  getRoadmaps : function (req, res, next) {
    var dbArgs = handleQuery(req.query);

    Roadmap.find(dbArgs.filters, dbArgs.fields, dbArgs.params)
      .populate('author nodes')
      .then(function(dbResults){
        res.json({data: dbResults});
      })
      .catch(handleError(next));
  },

  getRoadmapByID : function (req, res, next) {
    var _id = req.params.roadmapID;
    Roadmap.findById(_id)
      .populate('author nodes')
      .then(function(dbResults){
        res.json({data: dbResults});
      })
      .catch(handleError(next));
  },

  updateRoadmap : function (req, res, next) {
    var _id = req.params.roadmapID;
    var updateCommand = req.body;
    Roadmap.findByIdAndUpdate(_id, updateCommand, {new: true})
      .populate('author nodes')
      .then(function(dbResults){
        res.json({data: dbResults});
      })
      .catch(handleError(next));
  },

  deleteRoadmap : function (req, res, next) {
    var _id = req.params.roadmapID;
    Roadmap.findOne({_id:_id})
      .populate('author nodes')
      .then(function(roadmap){
        if (roadmap) roadmap.remove();
        res.json({data: roadmap});
      })
      .catch(handleError(next));
  }
  ,

  updateRoadmapUpVote : function (req, res, next) {
    var _id = req.params.roadmapID;
    console.log('this is the REQ BODY', req.body);
    Roadmap.findOne({_id:_id})
      // When id is found, add userId to the appropriate array (upvote, downvote);
      //     addToSet ensures that no duplicate items are added to set and does not affect 
      //     existing duplicate elements
      
      // .addToSet({upvotes: username})

      // .addToSet({downvotes: username})

      // Send data back, should include latest upvotes' and downvotes' arrays
      // Do I need a .then() and .catch() here?
      .then(function(data){
        console.log('THIS IS THE DATA FROM SERVER', data);
        res.write(res.statusCode.toString());
      })
      .catch(handleError(next));
  }

};