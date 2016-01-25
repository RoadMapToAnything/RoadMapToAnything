var mongoose = require('mongoose'),
    ObjectId = mongoose.Schema.ObjectId,
    triggers = require('../modelTriggers.js');

var NodeSchema = new mongoose.Schema({
    title        : { type: String,   required: true },
    description  : { type: String,   required: true },
    resourceType : { type: String,   required: true },
    resourceURL  : String,
    parentRoadmap: { type: ObjectId, ref: 'Roadmap'},
    created      : { type: Date },
    updated      : { type: Date }
});

triggers.Node(NodeSchema);

module.exports = mongoose.model('Node', NodeSchema);
