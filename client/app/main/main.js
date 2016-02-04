angular.module('main.ctrl', ['services.user'])
.controller('MainController', [ '$scope', '$state', 'User', function($scope, $state, User){
  
  $scope.logout = function () {
    User.logout();
    $('.button-collapse').sideNav('hide');
    $state.go('home');
  };
  
  $scope.isLoggedIn = User.isLoggedIn;

  $scope.getUsername = function () {
    return localStorage.getItem('user.username');
  };


}]);
