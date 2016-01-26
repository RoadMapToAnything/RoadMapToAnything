var mongoose = require('mongoose'),
    ObjectId = mongoose.Schema.ObjectId,
    hooks    = require('../modelTriggers.js');

var UserSchema = new mongoose.Schema({
  username : {type: String, required: true, unique: true},
  password : {type: String, required: true},
  firstName: {type: String},
  lastName : {type: String},
  roadmaps : [ { type: ObjectId, ref: 'Roadmap'} ],
  embarked : [ { type: ObjectId, ref: 'Roadmap'} ],
  created  : { type: Date},
  updated  : { type: Date}
});

var User = mongoose.model('User', UserSchema);

hooks.setUserHooks(UserSchema, User);
module.exports = User;