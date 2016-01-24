var mongoose = require('mongoose');
    ObjectId = mongoose.Schema.ObjectId;
    triggers = require('../modelTriggers.js');

var UserSchema = new mongoose.Schema({
  username : {type: String, required: true, unique: true},
  password : {type: String, required: true},
  firstName: {type: String},
  lastName : {type: String},
  roadmaps : [ { type: ObjectId, ref: 'Roadmap'} ],
  created  : { type: Date},
  updated  : { type: Date}
});


triggers.User(UserSchema);

module.exports = mongoose.model('User', UserSchema);