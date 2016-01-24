// This file contains all pre and post triggers for db
// interaction with our models. 

var User = require('./users/userModel.js'),
    Roadmap = require('./roadmaps/roadmapModel.js'),
    Node = require('./nodes/nodeModel.js');

/* * * * * * * * * * * * * * * * * * * * * 
 *                 USER                  *
 * * * * * * * * * * * * * * * * * * * * */

// This is a collector function which will trigger
// on all versions of the update trigger.
var updateUser = function (next) {
  this.updated = Date.now();

  next();
};

// All valid triggers are included here for reference.
module.exports.User = function(UserSchema) {

  UserSchema.pre('save', function(next) {
    var now = Date.now();

    if (!this.created) this.created = now;
    this.updated = now;

    next();
  });

  UserSchema.pre('remove', function(next) {
    next();
  });

  UserSchema.pre('validate', function(next) {
    next();
  });

  UserSchema.pre('update', function(next) {
    updateUser.call(this, next);
  });

  UserSchema.pre('findOneAndUpdate', function(next) {
    updateUser.call(this, next);
  });

  UserSchema.pre('findByIdAndUpdate', function(next) {
    updateUser.call(this, next);
  });

};


/* * * * * * * * * * * * * * * * * * * * * 
 *               ROADMAP                 *
 * * * * * * * * * * * * * * * * * * * * */

var updateRoadmap = function () {

};

module.exports.Roadmap = function(RoadmapSchema) {

};


/* * * * * * * * * * * * * * * * * * * * * 
 *                 NODE                  *
 * * * * * * * * * * * * * * * * * * * * */

var updateNode = function () {

};

module.exports.Node = function(NodeSchema) {

};