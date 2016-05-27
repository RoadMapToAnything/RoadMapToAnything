angular.module('roadmaps.factory', [])

  .factory('RoadmapsFactory', function($http){


    return {
      renderComments : function(comments){
        comments.map(function(comment,index){
          comment.index = index;
        });
        return comments;
      },

      getCountVotes : function(votes){
        var votesCount = 0;
        for(var i = 0; i < votes.length; i++){
          votesCount++;
        }
        return votesCount;
      }, 


      NODE_DEFAULTS: {
        title: 'New node title',
        description: 'New node description',
        resourceType: 'New node type',
        resourceURL: 'New node link (optional)',
        imageUrl: 'https://www.globalbrigades.org/media_gallery/thumb/320/0/VRS_Poster_512x512x32_2.png'
      },
      editorMsgHTML : '<div ng-hide="notAuthor()" class="editor-msg row blue lighten-4">' +
          '<div class="col s0 m1 l1">' +
            '<i class="fa fa-pencil fa-lg"></i>' +
          '</div>' +
          '<div class="col s0 m10 l10">' +
              'Since you created this roadmap, you can add or edit properties by clicking on them.' +
          '</div>' +
          '<div class="col s0 m1 l1">' +
            '<i class="fa fa-pencil fa-lg"></i>' +
          '</div>' +
        '</div>'
    };
  });