var mongoose = require('mongoose'),
    ObjectId = mongoose.Schema.ObjectId,
    hooks    = require('../modelTriggers.js');

var RoadmapSchema = new mongoose.Schema({
    title      : { type: String,   required: true },
    description: { type: String,   required: true },
    author     : { type: ObjectId, required: true, ref: 'User' },
    nodes      : [ { type: ObjectId, ref: 'Node'} ],
    created    : { type: Date },
    updated    : { type: Date },
    upvotes    : [],
    downvotes  : []
    // upvotes    : [{ type: ObjectId, ref: 'User'}],
    // downvotes  : [ { type: ObjectId, ref: 'User'} ]
});

hooks.setRoadmapHooks(RoadmapSchema);

module.exports = mongoose.model('Roadmap', RoadmapSchema);
