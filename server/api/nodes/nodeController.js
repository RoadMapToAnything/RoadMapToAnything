var mongoose = require('mongoose');

var NodeSchema = new mongoose.Schema({
    title        : { type: String,   required: true },
    description  : { type: String,   required: true },
    resourceType : { type: String,   required: true },
    resourceURL  : { type: String,   required: true },
    parentRoadmap: [ { type: ObjectId, ref: 'Roadmap'} ],
    created      : { type: Date, default: Date.now}
});

module.exports = mongoose.model('Node', NodeSchema);
