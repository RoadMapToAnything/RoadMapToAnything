angular.module('app.browse', [])

.controller('BrowseController', ['$scope', '$http','$state', function($scope, $http, $state){
  $scope.mapData = [];
  
  // this fn should be refactored to a factory -- a variattion is used by dashboard
  $scope.addTotalNodesOfMaps = function (arr){
    arr.forEach(function(map){
      map.totalNodes = map.nodes.length;
    });
  };

  $scope.getMapData = function () {
    $http({
      method: 'GET',
      url:'/api/roadmaps?sort=-created'
    })
      .then(
        //success callback
        function(response){
          console.log('getMaps response.data', response.data);
          $scope.mapData = response.data.data || [];
          $scope.addTotalNodesOfMaps($scope.mapData);
        },
        //failure callback
        function(err){
          console.log('error with getMapData request', err);
        }
      );
  };

  $scope.goToDash = function () {
    if( !$stateParams.username ){
      $state.go('signin');
    } else {
      $state.go('dashboard', {url: '/dashboard' + $stateParams.username});
    }
  }

  $scope.addMapToEmbarked = function (mapID) {
    console.log('embarking on map id:', mapID);
  }
  
  $scope.getMapData();

}]);
