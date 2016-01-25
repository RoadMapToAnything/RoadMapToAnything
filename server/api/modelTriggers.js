// This file contains all pre and post triggers for db
// interaction with our models. 

/* * * * * * * * * * * * * * * * * * * * * 
 *                 USER                  *
 * * * * * * * * * * * * * * * * * * * * */


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

// All valid triggers are included here for reference.
module.exports.User = function(UserSchema) {
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

module.exports.Roadmap = function(RoadmapSchema) {
  RoadmapSchema.pre('save', function(next) {
    setCreatedTimestamp.call(this, next);
  });

  RoadmapSchema.pre('remove', function(next) {
    next();
  });

  RoadmapSchema.pre('validate', function(next) {
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

module.exports.Node = function(NodeSchema) {

  NodeSchema.pre('save', function(next) {
    setCreatedTimestamp.call(this, next);
  });

  NodeSchema.pre('remove', function(next) {
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