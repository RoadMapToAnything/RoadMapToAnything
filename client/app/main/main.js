angular.module('main.ctrl', ['services.user'])
.controller('MainController', [ '$scope', '$state', 'User', function($scope, $state, User){
  
  $scope.logout = function () {
    User.logout();
    $state.go('home');
  };
  
  $scope.isLoggedIn = User.isLoggedIn;

  $scope.getUsername = function () {
    return localStorage.getItem('user.username');
  };

  console.log('Window height', window.innerHeight);

}]);
