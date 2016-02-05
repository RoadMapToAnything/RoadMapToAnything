angular.module('dash.ctrl', ['services.user'])

.controller('DashboardController', ['$scope','$http', '$state', 'User', 'Server', '$stateParams', function($scope, $http, $state, User, Server, $stateParams){

  $scope.followed = [];
  $scope.myMaps = [];
  $scope.completed = [];

  $scope.showFollowed = true;
  $scope.showMyMaps = false;
  $scope.showCompleted = false;


  var refreshUserData = function() {
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
  };


  refreshUserData();
  checkStateParams()

  function checkStateParams () {
    console.log('$stateParams.type', $stateParams.type)
    if( $stateParams.type === 'completed' ){
      refreshUserData();
      $scope.showFollowed = false;
      $scope.showMyMaps = false;
      $scope.showCompleted = true;
      angular.element( '#myMapsBtn' ).removeClass( 'pressed' );
      angular.element( '#followedBtn' ).removeClass( 'pressed' );
      angular.element( '#completedBtn' ).addClass( 'pressed' );
    }
  }

  $scope.unfollowMap = function (id) {
    User.unfollowMap(id)
    .then(function (user) {
      $scope.followed = user.inProgress.roadmaps;
    });
  };

  $scope.deleteMap = function (id) {
    Server.deleteMap(id)
    .then(function() {
      refreshUserData();
    });
  };

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







  $scope.goToMap = function (mapID){
    $state.go('home.roadmapTemplate', { 'roadmapID': mapID });
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

