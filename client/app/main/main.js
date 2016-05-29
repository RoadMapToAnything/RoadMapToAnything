angular.module('main.ctrl', ['ui.bootstrap', 'services.user'])
.controller('MainController', [ '$scope', '$state', 'User', '$http', 'Server', function($scope, $state, User, $http, Server){

  $scope.logout = function () {
    User.logout();
    $('.button-collapse').sideNav('hide');
    $state.go('home');
  };
  
  $scope.isLoggedIn = User.isLoggedIn;

  $scope.sidebarTo = function(newState){
    $('.button-collapse').sideNav('hide');
    $state.go(newState);
  }

  $scope.getUsername = function () {
    return localStorage.getItem('user.username');
  };

  $scope.openAuthModal = function() {
    $('#auth-modal').openModal();
  };

  $scope.openCreationModal = function() {
    $('#creation-modal').openModal();
  };

  $scope.newRoadmap = function() {
    Server.createRoadmap({
      title: $scope.roadmapTitle,
      description: $scope.roadmapDescription
    })
    .then(function(map){
      $('#creation-modal').closeModal();
      $('.button-collapse').sideNav('hide');
      $state.go( 'home.roadmapTemplate', {roadmapID: map._id} );
    })
    .catch(function(err){
      console.log('error creating new roadmap', err);
    });
  };

  /* * * Search and Typeahead  * * */

  $scope.typeaheadHash = {};

  $scope.submitSearch = function (){
    var roadmapID = $scope.typeaheadHash[$scope.asyncSelected];
    $state.go('home.roadmapTemplate', {roadmapID:roadmapID} );
  };

  $scope.populateTypeahead = function(roadmapTitle) {
    return $http.get('/api/roadmaps/search', {
      params: {
        title: roadmapTitle
      }
    }).then(function(response){
      return response.data.data.map(function(map){
        $scope.typeaheadHash[map.title] = map._id;
        return map.title;
      });
    });
  };

}]);
