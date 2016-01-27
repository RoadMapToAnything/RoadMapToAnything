angular.module('app.main', [])
.controller('MainController', [ '$scope', '$state', function($scope, $state){
  
  $scope.logout = function () {
    localStorage.removeItem('currentUser');
    console.log('logged out');
    $state.go('home');
  }
  
}]);
