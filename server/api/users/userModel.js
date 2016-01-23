var mongoose = require('mongoose');
    ObjectId = mongoose.Schema.ObjectId;

var UserSchema = new mongoose.Schema({
  username : {type: String, required: true, unique: true},
  password : {type: String, required: true},
  firstName: {type: String},
  lastName : {type: String},
  roadmaps : [ { type: ObjectId, ref: 'Roadmap'} ],
  created  : { type: Date},
  updated  : { type: Date}
});

module.exports = mongoose.model('User', UserSchema);

UserSchema.pre('save', function(next) {
  var now = Date.now();
  this.updated = now;
  if (!this.created) this.created = now;

  next();
});