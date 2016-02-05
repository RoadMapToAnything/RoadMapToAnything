var Roadmap = require('../roadmapModel.js'),
    User = require('../../users/userModel.js'),
    userController = require('../../users/userController.js'),
    Comment = require('./commentModel.js')
    ObjectId = require('mongoose').Types.ObjectId,
    handleError = require('../../../util.js').handleError,
    handleQuery = require('../../queryHandler.js'),
    getAuthHeader = require('basic-auth');
    
module.exports = {
  addComment : function (req, res, next) {
    var comment = req.body
    var subject = comment.subject;
    var content = comment.subject;
    var roadmap = comment.roadmap;
    var author  = comment.author;

    userController.returnId(author)
      .then(function(authorID){
        comment.author = authorID;
        var newComment = newComment(comment);
          newComment.save(function(err, comment){
            if (err) return console.error(err); 
          })
        })
        .then(function(dbResults){
          res.status(201).json({data: dbResults});
        })
        .catch(
          function(){
            console.log('API: error creating comment');
            handleError(next)
          });
      }
}


  