angular.module('creation.ctrl', ['services.server'])

.controller('CreationController', ['$scope', '$state', 'Server',  function($scope, $state, Server){


  $('select').material_select();


  $scope.nodeType = "Blog Post";

  $scope.createRoadmap = function() {
    return Server.createRoadmap({
      title: $scope.roadmapTitle,
      description: $scope.roadmapDescription
    })
    .then(function (roadmap) {
      $scope.roadmapID = roadmap._id;
    });
  };

  $scope.createNode = function() {
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
  $scope.checkThenCreate = function() {
    if (!$scope.roadmapID) {
      return $scope.createRoadmap().then(function() {
        return $scope.createNode();
      });

    } else {
      return $scope.createNode();
    }
  };

  $scope.submitAndRefresh = function() {
    $scope.checkThenCreate().then(function() {
      Materialize.updateTextFields();
    });
  };

  $scope.submitAndExit = function() {
    $scope.checkThenCreate().then(function() {
      $('#modal2').closeModal();
      $('.button-collapse').sideNav('hide');
      $state.go('home.roadmapTemplate', { 'roadmapID': $scope.roadmapID });
    }, 
    function(err){
      console.log('error with node creation request', err);
    });
  };

}])
