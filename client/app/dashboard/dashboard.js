angular.module('dash.ctrl', ['services.server', 'services.user'])

.controller('DashboardController', ['$scope', '$state', 'User', 'Server', '$timeout', function($scope, $state, User, Server, $timeout) {

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
      if( user.username.slice(0,11) === 'temp-FBUSER'){
        user.username = "";
        $('#username-submit-modal').openModal();

      }
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

  $scope.openUsernameModal = function() {
    $('#username-modal').openModal();
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

  $scope.editorVisible = function(editor) {
    return !!$scope[editor];
  };

  $scope.toggleEditor = function(editor) {
    $scope[editor] = !$scope[editor];
  };

  $scope.submitEdit = function(editor) {
    var property = editor.replace('editor.', '');
    var submission = {};

    submission[property] = $scope.user[property];

    User.update(submission)
    .then(function (user) {
      if(user.username.slice(0,11) !== "temp-FBUSER"){

        $scope.user = user;
        $scope[editor] = false;
        $('#username-submit-modal').closeModal();
        $('.lean-overlay').remove();
        $state.go('home.dashboard', {}, {reload: true});

      } else {

        $scope.differentUsername = true;
        $timeout(function(){
          $scope.differentUsername = false;
        }, 5000);

      }

    })
    // .catch(function(){
    //     $scope.differentUsername = true;
    //     $timeout(function(){
    //       $scope.differentUsername = false;
    //     }, 5000);
    // });
  };

  $scope.changeFbUsername = function(){
    var newUsername = $('#fb-username').val();
    User.update({username: newUsername})
    .then(function() {
      

      $('#username-submit-modal').closeModal();
      $('.lean-overlay').remove();
    //  $scope.inputImageUrl = '';
      $state.go('home.dashboard', {}, {reload: true});
    });


    // User.update({username: $('#fb-username').val() })
    // .then(function(res){
    //   if(res.username.slice(0,11) !== "temp-FBUSER"){
    //     $('#fbModal').closeModal();
    //   } else {
    //     $scope.differentUsername = true;
    //     $timeout(function(){
    //       $scope.differentUsername = false;
    //     }, 5000);
    //   }
    // });
  };

}]);
