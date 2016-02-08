var mongoose = require('mongoose'),
  ObjectId = mongoose.Schema.ObjectId,
  deepPopulate = require('mongoose-deep-populate')(mongoose),
  hooks    = require('../modelTriggers.js');

var NodeSchema = new mongoose.Schema({
  title         : { type: String,   required: true },
  description   : { type: String,   required: true },
  resourceType  : { type: String,   required: true },
  resourceURL   : { type: String },
  imageUrl      : { type: String },
  parentRoadmap : { type: ObjectId, ref: 'Roadmap'},
  siteName      : { type: String },
  siteIcon      : { type: String },
  author        : { type: String }, // This is the author of the resource, not a user
  price         : { type: String },
  duration      : { type: String },
  created       : { type: Date },
  updated       : { type: Date }
});

NodeSchema.plugin(deepPopulate);

hooks.setNodeHooks(NodeSchema);

module.exports = mongoose.model('Node', NodeSchema);
