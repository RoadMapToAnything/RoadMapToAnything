var mongoose = require('mongoose'),
    ObjectId = mongoose.Schema.ObjectId;

var NodeSchema = new mongoose.Schema({
    title        : { type: String,   required: true },
    description  : { type: String,   required: true },
    resourceType : { type: String,   required: true },
    resourceURL  : String,
    parentRoadmap: { type: ObjectId, ref: 'Roadmap'},
    created      : { type: Date, default: Date.now}
});

module.exports = mongoose.model('Node', NodeSchema);
