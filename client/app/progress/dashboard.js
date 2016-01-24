var request = require('request');

angular.module('app.dash', [])

.controller('DashboardController', function($scope){
  $scope.userName = "not_set";
  $scope.followedMaps = "unknown";

  $scope.getFollowedMaps = function(){
    console.log('calling getFollowedMaps');
    if( process.env.NODE_ENV === 'development'){
      request('localhost:3000/#/api/users/' + $scope.userName ), function (err, res, body){
        if(err) {
          console.log("error", err);
        } else if ( res.statusCode == 200 ){
          console.log("getFollowedMaps fail");
        } else {
          $scope.followedMapsResponseBody = body.roadmaps;
        }
    } else {
      request('http://roadmaptoanything.herokuapp.com/#/api/users/' + $scope.userName ), function (err, res, body){
        if(err) {
          console.log("error", err);
        } else if ( res.statusCode == 200 ){
          console.log("getFollowedMaps fail");
        } else {
          $scope.followedMapsResponseBody = body.roadmaps;
        }
    }
  };

});
