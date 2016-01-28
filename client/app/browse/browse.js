angular.module('app.browse', [])

.controller('BrowseController', ['$scope', '$http', '$state', '$timeout', function($scope, $http, $state, $timeout){
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
      $state.go('dashboard');
  }

  $scope.addMapToEmbarked = function (mapID) {
      $http({
        method: 'PUT',
        url: '/api/users/' + localStorage.getItem('user.username'), 
        data: {
          'inProgress.roadmaps': mapID
         }
      })
        .then(function(response){
          console.log('status', response.status);
          console.log('response.body', response.body);
        }, 
        function(response){
          $scope.showSigninMsg = true;
          $timeout(function(){
            $scope.showSigninMsg = false;
          }, 5000)
        });
  }

  $scope.goToMap = function (mapID){  //refactor to factory, dash also uses
    localStorage.setItem('currentRoadMap', mapID);
    $state.go('roadmapTemplate');
  }
  
  $scope.getMapData();

}]);
