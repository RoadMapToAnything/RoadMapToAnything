angular.module('roadmaps.ctrl', ['roadmaps.factory', 'services.server', 'services.user', 'scraper.ctrl'])

.controller('RoadmapsController', [ '$scope', '$stateParams', 'RoadmapsFactory', 'Server', 'User', '$timeout', '$state', function($scope, $stateParams, RoadmapsFactory, Server, User, $timeout, $state){  
  angular.extend($scope, RoadmapsFactory);

  var editingSelected = false;

  // Fetch the current roadmap and user from server and attach to $scope
  Server.getMap($stateParams.roadmapID)
  .then(function(map) {
    $scope.map = map;
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
    .then(function(response) {
      $scope.user = response.data;
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

  $scope.isEditing = function() {
    return editingSelected;
  };

  $scope.getNodeColor = function(node) {
    if ($scope.selected && node._id === $scope.selected._id) {
      return 'amber darken-1';
    }

    if ( $scope.isCompleted($scope.user, $scope.map, node) ) {
      return 'teal lighten-2';
    }

    return 'red lighten-2';
  };

}]);
