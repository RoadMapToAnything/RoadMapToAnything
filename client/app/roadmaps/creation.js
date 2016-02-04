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
      console.log('roadmap response:', roadmap);
      $scope.roadmapID = roadmap._id;
    });
  };

  $scope.createNode = function() {
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
  $scope.checkThenCreate = function() {
    console.log('$scope.roadmapID', $scope.roadmapID);
    if (!$scope.roadmapID) {
      console.log('creating roadmap and node');
      return $scope.createRoadmap().then(function() {
        return $scope.createNode();
      });

    } else {
      console.log('creating node');
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
      console.log('Node creation success');
      $('#modal2').closeModal();
      $('.button-collapse').sideNav('hide');
      $state.go('home.roadmapTemplate', { 'roadmapID': $scope.roadmapID });
    }, 
    function(err){
      console.log('error with node creation request', err);
    });
  };

}])
