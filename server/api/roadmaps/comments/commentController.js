var Roadmap = require('../roadmapModel.js'),
    User = require('../../users/userModel.js'),
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
    
    
    console.log('API: adding Comment');
    console.log('API: roadmap', roadmap);
    console.log('API: author', author);
    console.log('API: current content', content);

    
    User.findOne({username: author})
      .then(function(user){
        var userID = user._id;
        comment.author = userID;
        var newComment = new Comment(comment);
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


  