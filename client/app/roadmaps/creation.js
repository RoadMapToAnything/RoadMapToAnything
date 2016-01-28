angular.module('app.creation', [])

.controller('CreationController', function($scope,$http){
  localStorage.removeItem('user.currentRoadMap');

  // This is for the roadMap Creation Form
  // $scope.nodeBuilder = false;
  // $scope.checkTruth = function(){
  //   return $scope.nodeBuilder;
  // };

  var buildRoadmap = function() {
    author = localStorage.getItem('user.username') || 'bowieloverx950';
    console.log('roadmapTitle', $scope.roadmapTitle);
    console.log('roadmapDescription', $scope.roadmapDescription);

    return {
      title: $scope.roadmapTitle,
      description: $scope.roadmapDescription,
      author: author
    };
  };

  var postRoadmap = function(roadmap) {

   return $http({
      method: 'POST',
      url: '/api/roadmaps',
      data: roadmap
    }).then(function (res) {
      console.log('Roadmap created:', res.data.data);
      localStorage.setItem('user.currentRoadMap', response.data.data._id);
      // $scope.nodeBuilder = true;
    }, function(err){
      if (err) return err;
    });
  };

  $scope.test = function() {
    console.log('HELLO', $scope.roadmapTitle, '!!!');
  };

  var buildNode = function() {
    var parent = localStorage.getItem('user.currentRoadMap');

    if (!parent) {
      postRoadmap(buildRoadmap())
      .then(function (err) {
        if (err) return console.log(err);
        buildNode();
      });
    } else {
      return {
        title: $scope.nodeTitle,
        description: $scope.nodeDescription,
        resourceType: $scope.nodeType,
        resourceURL: $scope.nodeUrl,
        imageUrl: $scope.nodeImageUrl,
        parentRoadmap: parent
      };
    }
  };

  var postNode = function(node) {
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