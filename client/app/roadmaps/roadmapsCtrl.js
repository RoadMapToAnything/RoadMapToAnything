angular.module('roadmaps.ctrl', ['roadmaps.factory', 'services.server', 'services.user', 'scraper.ctrl'])

.controller('RoadmapsController', [ '$scope', '$stateParams', 'RoadmapsFactory', 'Server', 'User', '$timeout', '$state', function($scope, $stateParams, RoadmapsFactory, Server, User, $timeout, $state){  

  /**  Initialize Page  **/
  var editingSelected = false;
  var commentsVisible = false;

  $scope.truncate = RoadmapsFactory.truncate;

  Server.getMap($stateParams.roadmapID)
  .then(function(map) {
    $scope.map = map;
    console.log(map);

    if (!$scope.map.comments.length) {
      Server.createComment({
        subject: 'Test comment',
        content: 'Test description',
        roadmap: $scope.map._id
      });
    }

    // If the roadmap has no nodes, add one
    if (!map.nodes.length) $scope.addNode(0);
  });

  Server.getUser( localStorage.getItem('user.username') )
  .then(function(user) {
    $scope.user = user;
  });


  /**  Global State Methods **/
  $scope.isAuthor = function() {
    return $scope.user && $scope.user.username === $scope.map.author.username;
  };

  $scope.isEditing = function(node) {
    return editingSelected && (!node || node._id === $scope.selected._id);
  };

  $scope.isCompleted = function(node) {
    return RoadmapsFactory.isNodeCompleted($scope.user, $scope.map, node);
  };

  $scope.isCommentsVisible = function() {
    return commentsVisible;
  };


  /**  Node Timeline Button Methods  **/
  $scope.selectNode = function(node) {
    if (!editingSelected && $scope.selected && $scope.selected._id === node._id) {
      $scope.selected = false;
    } else {
      editingSelected = false;
      $scope.selected = node;
    }
  };

  $scope.editNode = function(node) {
    editingSelected = $scope.isAuthor();
    if (node) $scope.selected = node;
  };

  $scope.addNode = function(index) {
    var newNode = RoadmapsFactory.defaultNode;
    newNode.parentRoadmap = $scope.map._id;
    newNode.saveAtIndex = index + 1;

    Server.createNode(newNode)
    .then(function(node) {
      $scope.map.nodes.splice(index + 1, 0, node);
      $scope.editNode(node);
    });
  };

  $scope.completeNode = function(node) {
    User.completeNode(node._id)
    .then(function(user) {
      $scope.user = user;

      if ( RoadmapsFactory.isCompletedMapUntracked($scope.user, $scope.map) ) {
        User.completeMap( $scope.map._id )
        .then(function(user) {
          $scope.user = user;
          console.log(user);
        });
        Materialize.toast('Roadmap completed!', 4000, 'orangeToast');
      }
    });
  };

  $scope.getNodeColor = function(node) {
    if ($scope.selected && node._id === $scope.selected._id) {
      return 'amber darken-1';
    }

    if ( RoadmapsFactory.isNodeCompleted($scope.user, $scope.map, node) ) {
      return 'teal lighten-2';
    }

    return 'red lighten-2';
  };


  /**  Selected Node Card Methods  **/
  $scope.updateSelected = function() {
    Server.updateNode( $scope.selected )
    .then(function() {
      editingSelected = false;
    });
  };

  $scope.scrapeSelected = function() {
    Server.scrape( $scope.selected.resourceURL )
    .then(function(data){
      for (var key in data) {
        if (data[key]) $scope.selected[key] = data[key];
      }
    });
  };


  /**  Comments Section Methods  **/
  $scope.toggleComments = function() {
    commentsVisible = !commentsVisible;
    $('#comments-section').slideToggle();
  };

  $scope.submitComment = function() {
    Server.createComment({
      subject: $scope.commentTitle,
      content: $scope.commentContent,
      roadmap: $scope.map._id
    })
    .then(function(comment) {
      comment.author = $scope.user;
      $scope.map.comments.push(comment);
      $scope.commentTitle = '';
      $scope.commentContent = '';
      Materialize.resetTextFields();
    });
  };

  $scope.getCommentClass = function(index) {
    return index % 2 ? '' : 'odd-comment';
  };

}]);
