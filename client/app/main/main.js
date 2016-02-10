angular.module('main.ctrl', ['ui.bootstrap', 'services.user'])
.controller('MainController', [ '$scope', '$state', 'User', '$http', function($scope, $state, User, $http){
  
  $scope.logout = function () {
    User.logout();
    $('.button-collapse').sideNav('hide');
    $state.go('home');
  };
  
  $scope.isLoggedIn = User.isLoggedIn;

  $scope.getUsername = function () {
    return localStorage.getItem('user.username');
  };

  $scope.openAuthModal = function() {
    $('#auth-modal').openModal();
  };

  $scope.openCreationModal = function() {
    $('#creation-modal').openModal();
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
