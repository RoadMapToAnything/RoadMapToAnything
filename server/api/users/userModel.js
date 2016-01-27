var mongoose = require('mongoose'),
    ObjectId = mongoose.Schema.ObjectId,
    deepPopulate = require('mongoose-deep-populate')(mongoose);

    hooks    = require('../modelTriggers.js');

var UserSchema = new mongoose.Schema({
  username          : { type: String, required: true, unique: true },
  password          : { type: String, required: true },
  firstName         : { type: String },
  lastName          : { type: String },
  imageUrl          : { type: String },
  authoredRoadmaps  : [ {type: ObjectId, ref: 'Roadmap'} ],
  inProgress        : 
      {
          roadmaps  : [ {type: ObjectId, ref: 'Roadmap'} ],
          nodes     : [ {type: ObjectId, ref: 'Node'} ]
      },
  completedRoadmaps : [ {type: ObjectId, ref: 'Roadmap'} ],
  created           : { type: Date },
  updated           : { type: Date } 
});

UserSchema.plugin(deepPopulate);

hooks.setUserHooks(UserSchema);

module.exports = mongoose.model('User', UserSchema);