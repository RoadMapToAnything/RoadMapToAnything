var Roadmap = require('./roadmapModel.js'),
    userController = require('../users/userController.js'),
    ObjectId = require('mongoose').Types.ObjectId,
    handleError = require('../../util.js').handleError,
    handleQuery = require('../queryHandler.js'),
    getAuthHeader = require('basic-auth');
    

module.exports = {

  returnAuthor : function(id) {
    return Roadmap.findById(id)
    .populate('author')
    .then(function (roadmap) {
      if (roadmap) return roadmap.author.username;
    });
  },

  createRoadmap : function (req, res, next) {
    var author = getAuthHeader(req).name;
    var newRoadmap = req.body;

    userController.returnId(author)
      .then(function (id) {
        newRoadmap.author = id;
        return Roadmap(newRoadmap).save();
      })
      .then(function(dbResults){
        res.status(201).json({data: dbResults});
      })
      .catch(handleError(next));
  },

  searchRoadmaps : function (req, res, next) {
    var search = new RegExp(req.query.title, 'i');

    Roadmap.find({ title: search })
      .limit(3)
      .then(function(dbResults){
        res.json({data: dbResults});
      })
      .catch(handleError(next));
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
      .populate('author nodes comments')
      .then(function(dbResults){
        res.json({data: dbResults});
      })
      .catch(handleError(next));
  },

  updateRoadmap : function (req, res, next) {
    var _id = req.params.roadmapID;
    var author = getAuthHeader(req).name;
    var updateableFields = ['title','description','comments', 'ratings'];
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
            .populate('author nodes comments ratings');
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

  // Handles requests to /api/roadmaps/:roadmapID/:action
  actionHandler: function(req, res, next) {
    var roadmapID = req.params.roadmapID;
    var action    = req.params.action.toLowerCase();

    var actionMap = {
      
      follow  : function() {
        var command = { $addToSet: {'inProgress.roadmaps': roadmapID} };
        userController.updateRoadmap(command, req, res, next);
      },
      
      unfollow: function() {
        var command = { $pull: {'inProgress.roadmaps': roadmapID} };
        userController.updateRoadmap(command, req, res, next);
      },

      complete: function() {
        // triggers $pull from inProgress.nodes and inProgress.roadmaps via hooks
        var command = { $addToSet: {'completedRoadmaps'  : roadmapID} };
        userController.updateRoadmap(command, req, res, next);
      },

      upvote: function(){
        var author = getAuthHeader(req).name;
        userController.returnId(author)
          .then(function(userId) {
            var command = { $addToSet: { upvotes: userId } };
            return Roadmap.findByIdAndUpdate(roadmapID, command, {new: true})
          })
          .then(function(dbResults) {
            //dbResults should be a new roadmap
            res.json({data : dbResults});
          })
          .catch(handleError(next));
      },

      downvote: function(){
        var author = getAuthHeader(req).name;
        userController.returnId(author)
          .then(function(userId) {
            var command = { $addToSet: { downvotes: userId } };
            return Roadmap.findByIdAndUpdate(roadmapID, command, {new: true})
          })
          .then(function(dbResults) {
            res.json({data : dbResults});
          })
          .catch(handleError(next));
      }

    };

    if ( !actionMap.hasOwnProperty(action) ) return res.sendStatus(404);

    return actionMap[action]();
  }

};


