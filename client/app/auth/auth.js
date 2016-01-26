angular.module('app.auth', [])

.controller('AuthController', ['$scope', '$http', function($scope, $http){

  $scope.attemptedFirstName = '';
  $scope.attemptedLastName = '';
  $scope.attemptedUsername = '';
  $scope.attemptedPassword = '';

  $scope.showUnauthMsg = false;

  $scope.attemptLogin = function () {
    $scope.showUnauthMsg = false;
    $http.get('/api/login', {
      username: $scope.attemptedUsername,
      password: $scope.attemptedPassword
    })
    .then(
      //success callback
      function(res){
        console.log('sent login credentials');
        console.log('res.data', res.data);
        res.redirect('/#/dashboard?username=' + res.body.username);
      },
      //error callback
      function(res){
        console.log('res:', res);
        if(res.status === 401){
          console.log('unauthorized credentials');
          $scope.showUnauthMsg = true;
        }
      }
      );
  };

  $scope.attemptSignup = function () {
    $scope.showUnauthMsg = false;
    $http.post('/api/signup', {
      firstName: $scope.attemptedFirstName,
      lastName: $scope.attemptedLastName,
      username: $scope.attemptedUsername,
      password: $scope.attemptedPassword
    })
    .then(
      //success callback
      function(res){
        console.log('sent login credentials');
        console.log('res.data', res.data);
        res.redirect('/#/dashboard?username=' + res.body.username);
      },
      //error callback
      function(res){
        console.log('res:', res);
        if(res.status === 401){
          console.log('unauthorized credentials');
          $scope.showUnauthMsg = true;
        }
      }
      );
  };
  
}]);