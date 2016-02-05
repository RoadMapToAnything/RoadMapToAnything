var Comment = require('./commentModel.js'),
    userController = require('../../users/userController.js'),
    handleError = require('../../../util.js').handleError,
    getAuthHeader = require('basic-auth');
    
module.exports = {

  addComment : function (req, res, next) {
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
  }

};
