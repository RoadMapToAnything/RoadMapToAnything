var mongoose = require('mongoose'),
    ObjectId = mongoose.Schema.ObjectId,
    hooks    = require('../modelTriggers.js');

var NodeSchema = new mongoose.Schema({
    title        : { type: String,   required: true },
    description  : { type: String,   required: true },
    resourceType : { type: String,   required: true },
    resourceURL  : String,
    parentRoadmap: { type: ObjectId, ref: 'Roadmap'},
    created      : { type: Date },
    updated      : { type: Date }
});

var Node = mongoose.model('Node', NodeSchema);

hooks.setNodeHooks(NodeSchema, Node);
module.exports = Node;
