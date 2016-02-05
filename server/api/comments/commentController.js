var Comment = require('./commentModel.js'),
    userController = require('../users/userController.js'),
    handleError = require('../../util.js').handleError,
    getAuthHeader = require('basic-auth');
    
module.exports = {

  createComment : function (req, res, next) {
    var newComment = req.body;
    var author = getAuthHeader(req).name;

    userController.returnId(author)
    .then(function (id) {
      newComment.author = id;
      return Comment(newComment).save();
    })
    .then(function (comment){
      res.status(201).json({data: comment});
    })
    .catch(handleError(next));
  },

  deleteComment : function (req, res, next) {
    var id = req.params.commentId;
    var author = getAuthHeader(req).name;

    Comment.findById(id)
    .populate('author')
    .then(function (comment) {
      if (!comment) return res.sendStatus(404);
      if (comment.author.username !== author) return res.sendStatus(403);

      comment.remove();
      res.status(201).json({data: comment});
    })
    .catch(handleError(next));
  }

};