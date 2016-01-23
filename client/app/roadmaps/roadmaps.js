angular.module('app.roadmaps', [])
// Roadmaps have a title, description, author, nodes array, all nodes: , created time
  //
.controller('RoadMapsController', function($scope,$http){
  var roadMapUrl = 'testString';
  $scope.currentRoadMapData = {};
  // Get Data
  $scope.encapsulate = function(){  
    $http({
      method: 'GET',
      url: roadMapUrl
    }).then(function(response){
      $scope.currentRoadMapData = response;
    }, function(err){
      if (err) return err;
    });
  }

  // Render Title
  $scope.renderTitle = function(){
    var title = $scope.currentRoadMapData.title || 'test title';
    console.log(title);
    return title;  
  }

  $scope.selectNode = function() {
    alert('clicked node')
  }

  $scope.connectLines = function(){
    $(document).ready(function() {
      console.log('hello')
      $('.endPointForConnection').connections();      
    });
  };

  $scope.connectLines();
    


});