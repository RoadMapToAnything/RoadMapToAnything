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
    var author = getAuthHeader(req).name;

    var updateableFields = ['title','description'];
    var updateCommand = {};
    updateableFields.forEach(function(field){
      if (req.body[field] !== undefined) updateCommand[field] = req.body[field];
    });

    Roadmap.findOne({_id:_id})
      .populate('author')
      .then(function(roadmap){
        if (!roadmap) {
          res.sendStatus(404);
          return null;
        } else if (roadmap.author.username !== author) {
          res.sendStatus(403);
          return null;
        } else {
          return Roadmap.findByIdAndUpdate(_id, updateCommand, {new: true})
                        .populate('author nodes');
        }
      })
      .then(function(updatedRoadmap){
        if (updatedRoadmap) res.json({data: updatedRoadmap});
      })
      .catch(handleError(next));
      
  },

  deleteRoadmap : function (req, res, next) {
    var _id = req.params.roadmapID;
    var author = getAuthHeader(req).name;

    Roadmap.findOne({_id:_id})
      .populate('author nodes')
      .then(function(roadmap){
        if (!roadmap) res.sendStatus(404);
        else if (roadmap.author.username !== author) res.sendStatus(403);
        else {
          roadmap.remove();
          res.json({data: roadmap});
        }
      })
      .catch(handleError(next));
  },

  updateRoadmapUpVote : function (req, res, next) {
    var _id = req.params.roadmapID;
    //$addToSet will only add usernames not already in the upvotes array
    var updateUpVote = { $addToSet: { upvotes: req.body.username } };
    //find roadmap by id and trigger the $addToSet command
    Roadmap.findByIdAndUpdate(_id, updateUpVote, {new: true})
      .then(function(dbResults){
        console.log('DATA FROM SERVER AFTER UPVOTE:', dbResults);
        res.json({data: dbResults});
      })
      .catch(handleError(next));
  },

  updateRoadmapDownVote : function (req, res, next) {
    var _id = req.params.roadmapID;
    console.log('this is the REQUEST from server controller in downvote:', req);
    console.log('this is the REQ BODY USERNAME:', req.body.username); 
    var updateDownVote = { $pull : { upvotes: req.body.username } };
    Roadmap.findByIdAndUpdate(_id, updateDownVote, {new: true})
     .then(function(dbResults){
        console.log('server controller: DATA FROM SERVER AFTER DOWNVOTE:', dbResults);
        // res.write(res.statusCode.toString());
        // res.send(data);
        res.json({data: dbResults});
      })
      .catch(handleError(next));
  }

};


