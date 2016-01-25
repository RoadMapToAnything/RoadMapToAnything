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
      function(res){
        console.log('sent login credentials');
      },
      //error callback
      function(err, res){
        console.log('res::::', res);
        console.log('error sending credentials', err);
        if(res.statusCode === 401){
          console.log('unauthorized credentials');
        }
      }
      );
  };
}]);