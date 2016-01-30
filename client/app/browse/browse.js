angular.module('browse.ctrl', ['services.user'])

.controller('BrowseController', ['$scope', '$http', '$state', '$timeout', 'User', function($scope, $http, $state, $timeout, User){
  $scope.mapData = [];

  $scope.showSigninMsg = false;
  
  // this fn should be refactored to a factory -- a variattion is used by dashboard
  $scope.addTotalNodesOfMaps = function (arr){
    arr.forEach(function(map){
      map.totalNodes = map.nodes.length;
    });
  };

  $scope.isLoggedIn = User.isLoggedIn;

  $scope.getMapData = function () {
    $http({
      method: 'GET',
      url:'/api/roadmaps?sort=-created'
    })
      .then(
        //success callback
        function(response){
          console.log('Got sorted roadmaps:', response.data);
          $scope.mapData = response.data.data || [];
          $scope.addTotalNodesOfMaps($scope.mapData);
        },
        //failure callback
        function(err){
          console.log('Failed to get roadmaps:', err);
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
        .then(function (res){
          console.log('Roadmap added to embarked:', res.data.data.inProgress.roadmaps);
        }, 
        function(response){
          $scope.showSigninMsg = true;
          $timeout(function(){
            $scope.showSigninMsg = false;
          }, 5000)
        });
  }

  $scope.goToMap = function (mapID){  //refactor to factory, dash also uses
    localStorage.setItem('roadmap.id', mapID);
    $state.go('roadmapTemplate');
  }
  
  $scope.getMapData();

}]);
