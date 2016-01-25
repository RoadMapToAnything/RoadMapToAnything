var mongoose = require('mongoose'),
    ObjectId = mongoose.Schema.ObjectId,
    triggers = require('../modelTriggers.js');

var RoadmapSchema = new mongoose.Schema({
    title      : { type: String,   required: true },
    description: { type: String,   required: true },
    author     : { type: ObjectId, required: true, ref: 'User' },
    nodes      : [ { type: ObjectId, ref: 'Node'} ],
    created    : { type: Date },
    updated    : { type: Date },
});

triggers.Roadmap(RoadmapSchema);

module.exports = mongoose.model('Roadmap', RoadmapSchema);
