angular.module('app.auth', [])

.controller('AuthController', ['$scope', '$http', function($scope, $http){
  $scope.test = function(){
    console.log('Auth controller is working');
  };
  $scope.test();

  $scope.attemptLogin = function () {
    $http.get('/api/login?username=' + $scope.attemptedUsername + '&password=' + $scope.attemptedPassword )
    .then(
      //success callback
      function(){
        console.log('sent login credentials');
      },
      //error callback
      function(err){
        console.log('error sending credentials', err);
      }
      );
  };
}]);