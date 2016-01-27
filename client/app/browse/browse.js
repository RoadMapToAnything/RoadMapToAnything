angular.module('app.browse', [])

.controller('BrowseController', ['$scope', '$http', '$state', '$stateParams', '$timeout', function($scope, $http, $state, $stateParams, $timeout){
  $scope.mapData = [];

  $scope.showSigninMsg = false;
  
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
      $scope.showSigninMsg = true;
      $timeout(function(){
        $scope.showSigninMsg = false;
      }, 5000)
        
      
    } else {
      $state.go('dashboard', {url: '/dashboard' + $stateParams.username});
    }
  }

  $scope.addMapToEmbarked = function (mapID) {
    console.log('embarking on map id:', mapID);
  }
  
  $scope.getMapData();

}]);
