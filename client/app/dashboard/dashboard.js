angular.module('dash.ctrl', ['services.user'])

.controller('DashboardController', ['$scope','$http', '$state', 'User', 'Server', function($scope, $http, $state, User, Server){

  $scope.followed = [];
  $scope.myMaps = [];
  $scope.completed = [];

  $scope.showFollowed = true;
  $scope.showMyMaps = false;
  $scope.showCompleted = false;

  $scope.deleteMap = function( id ){
    Server.deleteRoadmapById(id);
    $scope.followed = $scope.updateLocalDataAfterDelete( $scope.followed , id );
    $scope.myMaps = $scope.updateLocalDataAfterDelete( $scope.myMaps , id );
    $scope.completed = $scope.updateLocalDataAfterDelete( $scope.completed , id );
  };
  //$scope.goToMap = DashboardFactory.goToMap;

  $scope.changeToFollowed = function(){
    $scope.showFollowed = true;
    $scope.showMyMaps = false;
    $scope.showCompleted = false;
    angular.element( '#myMapsBtn' ).removeClass( 'pressed' );
    angular.element( '#followedBtn' ).addClass( 'pressed' );
    angular.element( '#completedBtn' ).removeClass( 'pressed' );
  };

  $scope.changeToMyMaps = function(){
    $scope.showFollowed = false;
    $scope.showMyMaps = true;
    $scope.showCompleted = false;
    angular.element( '#myMapsBtn' ).addClass( 'pressed' );
    angular.element( '#followedBtn' ).removeClass( 'pressed' );
    angular.element( '#completedBtn' ).removeClass( 'pressed' );
  };

  $scope.changeToCompleted = function(){
    $scope.showFollowed = false;
    $scope.showMyMaps = false;
    $scope.showCompleted = true;
    angular.element( '#myMapsBtn' ).removeClass( 'pressed' );
    angular.element( '#followedBtn' ).removeClass( 'pressed' );
    angular.element( '#completedBtn' ).addClass( 'pressed' );
  };

  User.getData()
  .then(function (user) {
    $scope.user = user;
    $scope.myMaps = user.authoredRoadmaps;
    $scope.followed = user.inProgress.roadmaps;
    $scope.completed = user.completedRoadmaps;

    $scope.followed.forEach(function (map){
      var progress = User.getProgress(user, map._id);
      map.nodesCompleted = progress.completed;
      map.percentComplete = progress.percent;
    });
  });


  $scope.goToMap = function (mapID){  //refactor to factory, browse also uses
    localStorage.setItem('roadmap.id', mapID);
    $state.go('roadmapTemplate');
  };
  
  $scope.updateLocalDataAfterDelete = function (arr, id) {
    return arr.filter(function(map) {
      if( map._id === id ){
        return false;
      } else {
        return true;
      }
    });
  };

}]);

