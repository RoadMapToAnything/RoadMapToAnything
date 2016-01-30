angular.module('app.creation', [])

.controller('CreationController', function($scope, $http, $state, Server){

  // As user will be building a brand new roadmap, so the   
  // currently active one must be  removed from local storage
  localStorage.removeItem('roadmap.id');

  var createRoadmap = function() {
    return Server.createRoadmap({
      title: $scope.roadmapTitle,
      description: $scope.roadmapDescription
    })
    .then(function (roadmap) {
      localStorage.setItem('roadmap.id', roadmap._id);
    });
  };

  var createNode = function() {
    var parent = localStorage.getItem('roadmap.id');

    return Server.createNode({
      title: $scope.nodeTitle,
      description: $scope.nodeDescription,
      resourceType: $scope.nodeType,
      resourceURL: $scope.nodeUrl,
      imageUrl: $scope.nodeImageUrl,
      parentRoadmap: parent
    });
  };

  // Creates the roadmap before the node if necessary
  var checkThenCreate = function() {
    if (!localStorage.getItem('roadmap.id')) {
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
      $state.go('roadmapTemplate');
    });
  };

});