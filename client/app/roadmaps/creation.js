angular.module('creation.ctrl', ['services.server'])

.controller('CreationController', ['$scope', '$state', 'Server', function($scope, $state, Server){

  $scope.nodeType = "Blog Post";

  var createRoadmap = function() {
    return Server.createRoadmap({
      title: $scope.roadmapTitle,
      description: $scope.roadmapDescription
    })
    .then(function (roadmap) {
      console.log('roadmap response:', roadmap);
      $scope.roadmapID = roadmap._id;
    });
  };

  var createNode = function() {
  console.log('creating node with map id', $scope.roadmapID);
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
    console.log('$scope.roadmapID', $scope.roadmapID);
    if (!$scope.roadmapID) {
      console.log('creating roadmap and node');
      return createRoadmap().then(function() {
        return createNode();
      });

    } else {
      console.log('creating node');
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