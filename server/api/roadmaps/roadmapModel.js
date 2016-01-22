var mongoose = require('mongoose');

var RoadmapSchema = new mongoose.Schema({
    title      : { type: String,   required: true },
    description: { type: String,   required: true },
    author     : { type: ObjectId, required: true, ref: 'User' },
    nodes      : [ { type: ObjectId, ref: 'Node'} ],
    created    : { type: Date, default: Date.now}
});

module.exports = mongoose.model('Roadmap', RoadmapSchema);
