angular.module('app.auth', [])

.controller('AuthController', function($scope){
  $scope.test = function(){
    console.log('Auth controller is working');
  };
  $scope.test();
});