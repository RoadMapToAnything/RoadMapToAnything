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
    console.log('BUILD ROADMAP W/ AUTHOR', author);

    return {
      title: $scope.roadmapTitle,
      description: $scope.roadmapDescription,
      author: author
    };
  };

  var postRoadmap = function(roadmap) {
    console.log('POSTING ROADMAP', roadmap);

   return $http({
      method: 'POST',
      url: '/api/roadmaps',
      data: roadmap
    }).then(function (res) {
      console.log('Roadmap created:', res.data.data);
      localStorage.setItem('user.currentRoadMap', res.data.data._id);
      // $scope.nodeBuilder = true;
    }, function(err){
      if (err) return err;
    });
  };

  var buildNode = function() {
    var parent = localStorage.getItem('user.currentRoadMap');
    console.log('BUILD NODE W/ PARENT', parent);

    return {
      title: $scope.nodeTitle,
      description: $scope.nodeDescription,
      resourceType: $scope.nodeType,
      resourceURL: $scope.nodeUrl,
      imageUrl: $scope.nodeImageUrl,
      parentRoadmap: parent
    };
  };

  var postNode = function(node) {
    console.log('POSTING NODE', node);
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
    $scope.submitNode();
  };

  $scope.submitNode = function() {
    if (!localStorage.getItem('user.currentRoadMap')) {

      postRoadmap(buildRoadmap())
      .then(function (err) {
        if (err) return console.log(err);
        postNode(buildNode());
      });

    } else {
      postNode(buildNode());
    }
  };

});