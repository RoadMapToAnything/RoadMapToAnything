angular.module('app.main', [])
.controller('MainController', [ '$scope', '$state', function($scope, $state){
  
  $scope.logout = function () {
    localStorage.removeItem('user.username');
    localStorage.removeItem('user.currentRoadMap');
    localStorage.removeItem('user.authToken');
    console.log('logged out');
    $state.go('home');
  }
  
}]);
