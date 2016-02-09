angular.module('dash.ctrl', ['services.server', 'services.user'])

.controller('DashboardController', ['$scope', '$state', 'User', 'Server', function($scope, $state, User, Server) {

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

  var checkStateParams = function() {
    if( $state.params.type === 'completed' ) {
      refreshUserData();
      $scope.showFollowed = false;
      $scope.showMyMaps = false;
      $scope.showCompleted = true;
      angular.element( '#myMapsBtn' ).removeClass( 'pressed' );
      angular.element( '#followedBtn' ).removeClass( 'pressed' );
      angular.element( '#completedBtn' ).addClass( 'pressed' );
    }
  };

  checkStateParams();
  refreshUserData();
  


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

  $scope.openCreationModal = function() {
    $('#creation-modal').openModal();
  };

  $scope.openImageModal = function() {
    $('#image-submit-modal').openModal();
  };

  $scope.submitImageUrl = function() {
    User.update({imageUrl: $scope.inputImageUrl})
    .then(function() {
      $('#image-submit-modal').closeModal();
      $('.lean-overlay').remove();
      $scope.inputImageUrl = '';
      $state.go('home.dashboard', {}, {reload: true});
    });
  };

}]);

