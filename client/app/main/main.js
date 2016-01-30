angular.module('main.ctrl', [])
.controller('MainController', [ '$scope', '$state', function($scope, $state){
  
  $scope.logout = function () {
    var username = localStorage.getItem('user.username');
    localStorage.removeItem('user.username');
    localStorage.removeItem('roadmap.id');
    localStorage.removeItem('user.authToken');
    console.log(username, 'successfully logged out.');
    $state.go('home');
  };
  
  $scope.isLoggedIn = function () {
    return !!localStorage.getItem('user.username');
  };

  $scope.getUsername = function () {
    return localStorage.getItem('user.username');
  };

}]);
