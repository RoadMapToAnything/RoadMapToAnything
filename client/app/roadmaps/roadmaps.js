angular.module('app.roadmaps', [])

.controller('RoadMapsController', function($scope,$http){
  var roadMapUrl = 'testString';
  // Get Data
  $http({
    method: 'GET',
    url: roadMapUrl
  }).then(function(response){
    $scope.currentRoadMapData = response;
  }, function(err){
    if err return err;
  });

  // Render Title
  var renderTitle = function(){
    $scope.currentRoadMapData.title;  
  }
  

  
});