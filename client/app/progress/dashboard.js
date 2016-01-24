angular.module('app.dash', [])

.controller('DashboardController', ['$scope','$http', function($scope,$http){
  $scope.username = "";

  $scope.followedMapsResponseBody = {};

  $scope.myMapsResponseBody = {};

  $scope.dummyFollowedMapsResponseBody = {
    username: 'taylor',
    followedMaps: [{

    },{

    },{

    }]
  };

  $scope.dummyMyMapsResponseBody = {};

  //getDashboardData();


  // helper functions

  function getDashboardData (){
    angular.element(document).ready( function(){
        getMyMaps();
        getFollowedMaps();
      });
  }


  function getMyMaps (){
      console.log('calling getMyMaps');

  //    $http.get('http://roadmaptoanything.herokuapp.com/#/api/users/' + $scope.userName )
        $http.get('localhost:3000/#/api/users/' + $scope.userName )
          .then(function(response){
            $scope.myMapsResponseBody = response.body.roadmaps;
            }, function(err){
              console.log("error with MyMaps request", err);
            });
    }

  function getFollowedMaps (){
      console.log('calling getFollowedMaps');
  //    $http.get('http://roadmaptoanything.herokuapp.com/#/api/users/' + $scope.userName )
        $http.get('localhost:3000/#/api/users/' + $scope.userName )
          .then(function(response){
            $scope.followedMapsResponseBody = response.body.roadmaps;
            }, function(err){
              console.log('error with followedMaps request', err);
            });
    }
}]);


