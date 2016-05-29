angular.module('roadmaps.ctrl', ['roadmaps.factory', 'services.server', 'services.user', 'scraper.ctrl'])

.controller('RoadmapsController', [ '$scope', '$stateParams', 'RoadmapsFactory', 'Server', 'User', '$timeout', '$state', function($scope, $stateParams, RoadmapsFactory, Server, User, $timeout, $state){  
  var editingSelected = false;

  $scope.truncate = RoadmapsFactory.truncate;

  // Fetch the current roadmap and user from server and attach to $scope
  Server.getMap($stateParams.roadmapID)
  .then(function(map) {
    $scope.map = map;

    if (!map.nodes.length) $scope.addNode(0);
  });

  Server.getUser( localStorage.getItem('user.username') )
  .then(function(user) {
    $scope.user = user;
  });

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
    $scope.selected = node;
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

  $scope.updateSelected = function() {
    Server.updateNode( $scope.selected );
  };

  $scope.scrapeSelected = function() {
    Server.scrape( $scope.selected.resourceURL )
    .then(function(data){
      for (var key in data) {
        if (data[key]) $scope.selected[key] = data[key];
      }
    });
  };

  $scope.isAuthor = function() {
    return $scope.user && $scope.user.username === $scope.map.author.username;
  };

  $scope.isEditing = function(node) {
    return editingSelected && (!node || node._id === $scope.selected._id);
  };

  $scope.isCompleted = function(node) {
    return RoadmapsFactory.isNodeCompleted($scope.user, $scope.map, node);
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

}]);
