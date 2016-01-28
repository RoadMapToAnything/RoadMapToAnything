angular.module('app.dash', [])

.controller('DashboardController', ['$scope','$http', '$state', function($scope, $http, $state){

  $scope.username = '';

  $scope.followedMapsResponseBody = {};

  $scope.myMapsResponseBody = {};

  $scope.hideMyMaps = true;

  $scope.followed = [];

  $scope.myMaps = [];

  $scope.followedTotalNodes = 0;

  // helper functions

  $scope.showMyMaps = function(){
      $scope.hideMyMaps = false;
      angular.element( '#myMapsBtn' ).addClass( 'pressed' );
      angular.element( '#followedBtn' ).removeClass( 'pressed' );
  };

  $scope.showFollowed = function(){
      $scope.hideMyMaps = true;
      angular.element( '#myMapsBtn' ).removeClass( 'pressed' );
      angular.element( '#followedBtn' ).addClass( 'pressed' );
  };

  $scope.addTotalNodesOfFollowedMaps = function (arr){
    console.log('followed arr', Array.isArray(arr));
    arr.forEach(function(map){
      console.log('followed totalNodes', map.nodes.length);
      map.totalNodes = map.nodes.length;
    });
  };

  $scope.addTotalNodesOfMyMaps = function (arr){
    console.log('myMaps arr', Array.isArray(arr));
    arr.forEach(function(map){
      console.log('totalNodes for myMaps', map.nodes.length);
      map.totalNodes = map.nodes.length;
    });
  };

  $scope.getMyMaps = function (){
      console.log('calling getMyMaps');
  //    $http.get('http://roadmaptoanything.herokuapp.com/#/api/users/' + $scope.userName )
        $http.get('/api/users/' + localStorage.getItem('user.username') )
          .then(function(response){
              console.log('myMaps response.data', response.data);
              $scope.myMaps = response.data.data.authoredRoadmaps || [];
              $scope.addTotalNodesOfMyMaps($scope.myMaps);
            }, function(err){
              console.log("error with MyMaps request", err);
            });
    };

  $scope.getFollowedMaps = function (){
      console.log('calling getFollowedMaps');
  //    $http.get('http://roadmaptoanything.herokuapp.com/#/api/users/' + $scope.userName )
        $http.get('/api/users/' + localStorage.getItem('user.username') )
          .then(function(response){
              console.log('followed response.data', response.data);
              $scope.followed = response.data.data.inProgress.roadmaps || [];
              $scope.addTotalNodesOfFollowedMaps($scope.followed);
            }, function(err){
              console.log('error with followedMaps request', err);
            });
    };


  $scope.addCompletedNodes = function(){
    $scope.followed.forEach(function(map){
      map.percentComplete = Math.floor((map.completed / map.totalNodes) * 100);
    });

    $scope.dummyMyMaps.forEach(function(map){
      map.percentComplete = Math.floor((map.completed / map.totalNodes) * 100);
    });
  };

  $scope.getDashboardData = function(){
    angular.element(document).ready( function(){
        $scope.getMyMaps();
        $scope.getFollowedMaps();
      });
  };

  $scope.goToMap = function (mapID){  //refactor to factory, browse also uses
    console.log('go to map', mapID);
    localStorage.setItem('user.currentRoadMap', mapID);
    $state.go('roadmapTemplate');
  }
  
  $scope.deleteMap = function(mapID){
    $http({
      method: 'DELETE',
      url: '/api/roadmaps/' + mapID
    })
      .then(
        //success
        function(response){
          console.log('deleted');
          console.log('status', response.status);
          console.log('response body', response.body);
        },
        function(response){
          console.log('failed to delete');
          console.log('status', response.status);
          console.log('response body', response.body);
        })
  }
//make ajax calls to get table data
  $scope.getDashboardData();

}]);


