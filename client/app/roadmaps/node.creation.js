angular.module('app.node.creation', [])

.controller('NodeCreationController', function($scope,$http){

  var buildNode = function() {
    var parent = localStorage.getItem('roadmapId') || '56a93ffb4e8f0b80594acbb5';

    return {
      title: $scope.nodeTitle,
      description: $scope.nodeDescription,
      resourceType: $scope.nodeType,
      resourceURL: $scope.nodeUrl,
      imageUrl: $scope.nodeImageUrl,
      parentRoadmap: parent
    };
  };

  var postNode = function (node) {
    return $http({
      method: 'POST',
      url: '/api/nodes',
      data: node
    })
    .then(function (res) {
      console.log('Node created:', res.data.data);
    });
  };

  $scope.submitAndRefresh = function() {
    Materialize.updateTextFields();
    postNode(buildNode());
  };

  $scope.submitAndFinish = function() {
    postNode(buildNode());
  };



});