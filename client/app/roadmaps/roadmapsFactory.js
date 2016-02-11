angular.module('roadmaps.factory', [])

  .factory('RoadmapsFactory', function($http){


    return {
      renderComments : function(comments){
        comments.map(function(comment,index){
          comment.index = index;
        })
        return comments;
      },


      NODE_DEFAULTS: {
        title: 'New node title',
        description: 'New node description',
        resourceType: 'New node type',
        resourceURL: 'New node link (optional)',
        imageUrl: 'https://openclipart.org/image/2400px/svg_to_png/103885/SimpleStar.png'
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