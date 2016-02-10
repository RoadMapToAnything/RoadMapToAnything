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

  calculateWilsonScore : function(roadmap) {
    
    var wilsonScore = function(p,n){      
      return ((p + 1.9208) / (p + n) - 1.96 * Math.sqrt((p * n) / (p + n) + 0.9604) / (p + n)) / (1 + 3.8416 / (p + n));
    };


    completions = roadmap.completions || 1;
    upvotes = roadmap.upvotes.length;
    downvotes = roadmap.downvotes.length;
    comments = roadmap.comments.length;
    totalVotes = upvotes + downvotes;

    var normalizeCompletions = function(completions, upvotes){
      /*We want upvotes as the parameter to normalize by because if a roadmap is overwhelmingly
        negative our completions would artificially make the roadmap more visible. By using upvotes
        completions of a good roadmap get boosted highly, but completions of a bad roadmap don't subject
        more people to the bad roadmap. Furthermore, controversial roadmaps will have a boost given to them
        making them more visible, allowing for its goodness/badness to be decided through more visibility
      */
      

      var lowerBound = Math.round(upvotes * .3);
      // If a roadmap has a lot of completions but no upvotes 
        // A completion is worth 3 upvotes
      var upperBound = completions * 3;

      console.log(upperBound);
      console.log(lowerBound);
      /*
        Right now we are saying that we expect a factor of 10% completions per upvote. 
        If we have a small roadmap with a lot of completions those get weighted more heavily. Up until
        the point where we approach the maximum limit we want upvotes to account for.
      */
      // The smaller the roadmap the more a completion is worth
      // 1 completion is worth 3 upvotes but can only contrbute an extra 30% of upvotes to final score
      var completionScore = lowerBound >= upperBound ? lowerBound : upperBound;
      return completionScore; 
    }


    var normalizeComments = function(upvotes,downvotes, comments) {
      // Comments are more swingy. In general a comment can be something bad or something good.
        // Since this is a score of if the roadmap is a "good map" 
        // The effect of comments should take into account whether the sentiment indicated by upvotes/downvotes
        // is overwhelmingly negative or positive.
        var netRating = upvotes - downvotes;
        var totalRatings = upvotes  + downvotes
        if ( netRating >= totalRatings * 1.2  ) {
          var positiveRoadmap = true;
        } else if (netRating <= (0 - totalRatings * 1.2)) {
          var negativeRoadmap = true;
        } else {
          var neutralRoadmap = true;
        }
        // If upvotes + downvotes < 100  default to neutral (not significant enough)
          // if 20% of total votes in either negative or positive direction we call it a either positive or negative roadmap else neutral

        var upperBound, lowerBound, completionScore;
        if (neutralRoadmap){
          upperBound = comments * 2;
          lowerBound = upvotes * .1;
          completionScore = Math.min(upperBound,lowerBound);
        } else{
          upperBound = comments * 2;
          lowerBound = upvotes * .15;
          completionScore = Math.min(upperBound,lowerBound);
          completionScore = positiveRoadmap === true ? completionScore : completionScore * -1;
        }

        return completionScore;


    }
    
    var positiveScore = upvotes + normalizeCompletions(completions, upvotes) + normalizeComments(upvotes,downvotes,comments);


    scored = wilsonScore(positiveScore,downvotes);
    console.log(scored, 'WilsonScore')
    return scored;

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

        Roadmap.findById(roadmapID, function(err, roadmap){
          var nodeLength = roadmap.nodes.length;
          roadmap.completions = roadmap.completions + 1;
          roadmap.save();
          next();
        });
        
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


