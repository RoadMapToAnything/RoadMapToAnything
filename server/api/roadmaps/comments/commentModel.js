var mongoose = require('mongoose'),
    ObjectId = mongoose.Schema.ObjectId,
    hooks    = require('../../modelTriggers.js');
    


var CommentSchema = new mongoose.Schema({
    subject: { type: String,   required: true },
    content: { type: String,   required: true },
    roadmap: { type: ObjectId, required: true, ref: 'Roadmap'},
    author     : { type: ObjectId, required: false, ref: 'User' },
    created    : { type: Date }
});

hooks.setCommentHooks(CommentSchema);

module.exports = mongoose.model('Comment', CommentSchema);
