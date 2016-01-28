angular.module('app.creation', [])

.controller('CreationController', function($scope,$http){

  // This is for the roadMap Creation Form
  $scope.nodeBuilder = false;
  $scope.checkTruth = function(){
    return $scope.nodeBuilder;
  }

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

  $scope.createRoadMap = function(data){
    data.author = localStorage.getItem('currentUser') || 'testAuthor';
    
   return $http({
        method: 'POST',
        url: '/api/roadmaps',
        data: data
      }).then(function(response){
        console.log(response.data.data)
        localStorage.setItem('roadmapId', response.data.data.id)
        $scope.nodeBuilder = true;
        console.log($scope.nodeBuilder)
      }, function(err){
        if (err) return err;
      });
  }



});