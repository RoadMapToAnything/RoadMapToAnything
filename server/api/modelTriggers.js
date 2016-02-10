// This file contains all pre and post hooks for db
// interaction with our models. 

// Triggers for all db models when created.
var setCreatedTimestamp = function (next) {
  var now = Date.now();

  if (this.isNew) this.created = now;
  this.updated = now;

  next();
};

// Triggers for all db models when updated.
var setUpdatedTimestamp = function (next) {
  this.update({},{ $set: { updated: Date.now() } });

  next();
};


/* * * * * * * * * * * * * * * * * * * * * 
 *                 USER                  *
 * * * * * * * * * * * * * * * * * * * * */

// Changes all direct array modifcation to Users to a '$addToSet'.
var setifyArrayUpdate = function (UserSchema, next) {
  var update = this._update;
  var arrayNames = [];
  
  // Gather the names of all arrays in the User Schema.
  for (var key in UserSchema.paths) {
    if(UserSchema.paths[key].instance === 'Array') {
      arrayNames.push(UserSchema.paths[key].path);
    }
  }

  // Check to see if any of those arrays are being directly updated,
  // and if so, add them to the set instead.
  arrayNames.forEach(function (name) {
    if (update[name]) {
      update.$addToSet = update.$addToSet || {};
      update.$addToSet[name] = update[name];
      delete update[name];
    }
  });

  next();
};

// If a completedRoadmap is being pushed, 
// removes that roadmap and child nodes from inProgress.
var handleCompletedRoadmaps = function (next) {
  var Node = require('./nodes/nodeModel.js');
  var query = this;
  var completed;

  if (query._update.$addToSet) {
    completed = query._update.$addToSet['completedRoadmaps'];
  }

  if(completed) { 
    query.update({}, { $pull:{ 'inProgress.roadmaps': completed } });
    Node.find({parentRoadmap: completed})
      .then(function (nodes) {
        nodes.forEach(function (node) {
          query.update({}, { $pull:{ 'inProgress.nodes': node._id } });
        });
        next();
      });
  } else {
    next();
  }
};

module.exports.setUserHooks = function(UserSchema) {
  UserSchema.pre('save', function(next) {
    setCreatedTimestamp.call(this, next);
  });

  UserSchema.pre('remove', function(next) {
    // TODO: Decide how roadmaps behave when their author is removed.
    next();
  });

  UserSchema.pre('update', function(next) {
    var query = this;
    setifyArrayUpdate.call(query, UserSchema, function() {
      handleCompletedRoadmaps.call(query, function() {
        setUpdatedTimestamp.call(query, next);
      });
    });
  });

  UserSchema.pre('findOneAndUpdate', function(next) {
    var query = this;
    setifyArrayUpdate.call(query, UserSchema, function() {
      handleCompletedRoadmaps.call(query, function() {
        setUpdatedTimestamp.call(query, next);
      });
    });
  });

  UserSchema.pre('findByIdAndUpdate', function(next) {
    var query = this;
    setifyArrayUpdate.call(query, UserSchema, function() {
      handleCompletedRoadmaps.call(query, function() {
        setUpdatedTimestamp.call(query, next);
      });
    });
  });

};


/* * * * * * * * * * * * * * * * * * * * * 
 *               ROADMAP                 *
 * * * * * * * * * * * * * * * * * * * * */

var convertProperties = function(roadmap) {
  
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

}

var updateRating = function(roadmap) {
  roadmap.rating = roadmap.upvotes.length - roadmap.downvotes.length;
  roadmap.bestRating = convertProperties(roadmap);
  roadmap.save();
};

// If a user upvotes a roadmap, remove their downvote and vice versa
var upvoteDownvote = function(next) {
  var addSet = this._update.$addToSet;
  var roadmapID = this._conditions;


  if (addSet) {
    if (addSet.upvotes) this.update({},{ $pull:{downvotes: addSet.upvotes} });
    if (addSet.downvotes) this.update({},{ $pull:{upvotes: addSet.downvotes} });
  }
  next();
};

module.exports.setRoadmapHooks = function(RoadmapSchema) {
  RoadmapSchema.pre('save', function(next) {
    // On creation of a Roadmap, push it's ID to the author's roadmaps array
    if (this.isNew) {
      var User = require('./users/userModel.js');
      var authorID = this.author;
      var roadmapID = this._id;

      var update = { $push:{ authoredRoadmaps: roadmapID } };

      User.findByIdAndUpdate(authorID, update)
        .exec(function(err){ if (err) throw err; });     
    }

    setCreatedTimestamp.call(this, next);
  });

  RoadmapSchema.pre('remove', function(next) {
    // On deletion of a Roadmap, remove it's ID from the author's roadmaps array,
    // and delete all associated nodes
    var User = require('./users/userModel.js');
    var Node = require('./nodes/nodeModel.js');
    var authorID = this.author;
    var roadmapID = this._id;
    var nodes = this.nodes;

    var userUpdate = { $pull:{ authoredRoadmaps: roadmapID } };

    User.findByIdAndUpdate(authorID, userUpdate)
      .exec(function(err){ if (err) throw err; });  

    nodes.forEach(function(nodeID){
      Node.findByIdAndRemove(nodeID)
        .exec(function(err){ if (err) throw err; });  
    });

    next();
  });

  RoadmapSchema.pre('update', function(next) {
    var query = this;
    upvoteDownvote.call(query, function() {
      setUpdatedTimestamp.call(query, next);
    });
  });

  RoadmapSchema.pre('findOneAndUpdate', function(next) {
    var query = this;
    upvoteDownvote.call(query, function() {
      setUpdatedTimestamp.call(query, next);
    });
  });

  RoadmapSchema.pre('findByIdAndUpdate', function(next) {
    var query = this;
    upvoteDownvote.call(query, function() {
      setUpdatedTimestamp.call(query, next);
    });
  });

  RoadmapSchema.post('update', function(roadmap) {
    updateRating(roadmap);
  });

  RoadmapSchema.post('findOneAndUpdate', function(roadmap) {
    updateRating(roadmap);
  });

  RoadmapSchema.post('findByIdAndUpdate', function(roadmap) {
    updateRating(roadmap);
  });
};


/* * * * * * * * * * * * * * * * * * * * * 
 *                 NODE                  *
 * * * * * * * * * * * * * * * * * * * * */

module.exports.setNodeHooks = function(NodeSchema) {
  NodeSchema.pre('save', function(next) {
    // On creation of a Node, push it's ID to the parent Roadmaps nodes array
    if (this.isNew) {
      var Roadmap = require('./roadmaps/roadmapModel.js');
      var parentRoadmapID = this.parentRoadmap;
      var newNodeID = this._id;

      var update = { $push:{ nodes: newNodeID } };

      Roadmap.findByIdAndUpdate(parentRoadmapID, update)
        .exec(function(err){ if (err) throw err; });     
    }

    setCreatedTimestamp.call(this, next);
  });

  NodeSchema.pre('remove', function(next) {
    // On deletion of a Node, remove it's ID from the parent Roadmaps nodes array
    var Roadmap = require('./roadmaps/roadmapModel.js');
    var parentRoadmapID = this.parentRoadmap;
    var deletedNodeID = this._id;

    var update = { $pull:{ nodes: deletedNodeID } };

    Roadmap.findByIdAndUpdate(parentRoadmapID, update)
      .exec(function(err){ if (err) throw err; });  

    next();
  });

  NodeSchema.pre('update', function(next) {
    setUpdatedTimestamp.call(this, next);
  });

  NodeSchema.pre('findOneAndUpdate', function(next) {
    setUpdatedTimestamp.call(this, next);
  });

  NodeSchema.pre('findByIdAndUpdate', function(next) {
    setUpdatedTimestamp.call(this, next);
  });

};


module.exports.setCommentHooks = function(CommentSchema) {
  CommentSchema.pre('save', function(next) {
    if (this.isNew) {
      var Roadmap = require('./roadmaps/roadmapModel.js');
      var User = require('./users/userModel.js');
      var authorId = this.author;
      var roadmapId = this.roadmap;
      var commentId = this._id;

      var authorUpdate = {$push: {comments: commentId}};
      var roadmapUpdate = {$push: {comments: commentId}};

      Roadmap.findByIdAndUpdate(roadmapId, roadmapUpdate)
        .exec(function(err){ if (err) throw err; });

      User.findByIdAndUpdate(authorId, authorUpdate)
        .exec(function(err){ if (err) throw err; });  
    }

    setCreatedTimestamp.call(this, next);
  });

  CommentSchema.pre('remove', function(next) {
    // TODO: Decide how comments behave when their author is removed.
    var Roadmap = require('./roadmaps/roadmapModel.js');
    var User = require('./users/userModel.js');
    var authorId = this.author;
    var roadmapId = this.roadmap;

    var authorUpdate = {$pull: {comments: this._id}};
    var roadmapUpdate = {$pull: {comments: this._id}};

    Roadmap.findByIdAndUpdate(roadmapId, roadmapUpdate)
    .exec(function(err){ if (err) throw err; });

    User.findByIdAndUpdate(authorId, authorUpdate)
    .exec(function(err){ if (err) throw err; });  

    next();
  });

};