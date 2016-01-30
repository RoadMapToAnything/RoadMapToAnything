angular.module('creation.ctrl', ['services.server'])

.controller('CreationController', ['$scope', '$state', 'Server', function($scope, $state, Server){

  var createRoadmap = function() {
    return Server.createRoadmap({
      title: $scope.roadmapTitle,
      description: $scope.roadmapDescription
    })
    .then(function (roadmap) {
      $scope.roadmapID = roadmap._id;
    });
  };

  var createNode = function() {;

    return Server.createNode({
      title: $scope.nodeTitle,
      description: $scope.nodeDescription,
      resourceType: $scope.nodeType,
      resourceURL: $scope.nodeUrl,
      imageUrl: $scope.nodeImageUrl,
      parentRoadmap: $scope.roadmapID
    });
  };

  // Creates the roadmap before the node if necessary
  var checkThenCreate = function() {
    if (!$scope.roadmapID) {
      return createRoadmap().then(function() {
        return createNode();
      });

    } else {
      return createNode();
    }
  };

  $scope.submitAndRefresh = function() {
    checkThenCreate().then(function() {
      Materialize.updateTextFields();
    });
  };

  $scope.submitAndExit = function() {
    checkThenCreate().then(function() {
      $state.go('home.roadmapTemplate', { 'roadmapID': $scope.roadmapID });
    });
  };

}]);