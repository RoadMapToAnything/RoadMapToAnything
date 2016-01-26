// This file contains all pre and post triggers for db
// interaction with our models. 

var setCreatedTimestamp = function (next) {
  var now = Date.now();

  if (this.isNew) this.created = now;
  this.updated = now;

  next();
};

// This is a collector function which will trigger
// on all versions of the update trigger.
var setUpdatedTimestamp = function (next) {
  this.update({},{ $set: { updated: Date.now() } });

  next();
};


/* * * * * * * * * * * * * * * * * * * * * 
 *                 USER                  *
 * * * * * * * * * * * * * * * * * * * * */

// All valid triggers are included here for reference.
module.exports.setUserHooks = function(UserSchema, User) {
  UserSchema.pre('save', function(next) {
    setCreatedTimestamp.call(this, next);
  });

  UserSchema.pre('remove', function(next) {
    next();
  });

  UserSchema.pre('validate', function(next) {
    next();
  });

  UserSchema.pre('update', function(next) {
    setUpdatedTimestamp.call(this, next);
  });

  UserSchema.pre('findOneAndUpdate', function(next) {
    setUpdatedTimestamp.call(this, next);
  });

  UserSchema.pre('findByIdAndUpdate', function(next) {
    setUpdatedTimestamp.call(this, next);
  });

};


/* * * * * * * * * * * * * * * * * * * * * 
 *               ROADMAP                 *
 * * * * * * * * * * * * * * * * * * * * */

module.exports.setRoadmapHooks = function(RoadmapSchema, Roadmap) {
  RoadmapSchema.pre('save', function(next) {
    setCreatedTimestamp.call(this, next);
  });

  RoadmapSchema.pre('remove', function(next) {
    next();
  });

  RoadmapSchema.pre('update', function(next) {
    setUpdatedTimestamp.call(this, next);
  });

  RoadmapSchema.pre('findOneAndUpdate', function(next) {
    setUpdatedTimestamp.call(this, next);
  });

  RoadmapSchema.pre('findByIdAndUpdate', function(next) {
    setUpdatedTimestamp.call(this, next);
  });
};


/* * * * * * * * * * * * * * * * * * * * * 
 *                 NODE                  *
 * * * * * * * * * * * * * * * * * * * * */

module.exports.setNodeHooks = function(NodeSchema, Node) {
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

  NodeSchema.pre('validate', function(next) {
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