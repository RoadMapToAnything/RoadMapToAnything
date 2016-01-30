angular.module('auth.ctrl', [])

.controller('AuthController', ['$scope', '$http','$state', function($scope, $http, $state){

  $scope.attemptedFirstName = '';
  $scope.attemptedLastName = '';
  $scope.attemptedUsername = '';
  $scope.attemptedPassword = '';

  $scope.showUnauthMsg = false;

  $scope.attemptLogin = function () {
    $scope.showUnauthMsg = false;
    $http({
      url: '/api/login?username=' + $scope.attemptedUsername + '&password=' + $scope.attemptedPassword,
      method: 'GET'
    })
    .then(
      //success callback
      function(res){
        console.log('Logged in with response data:', res.data);
        localStorage.setItem('user.username', $scope.attemptedUsername);
        localStorage.setItem('user.authToken', res.data.data.authToken);
        $state.go('dashboard');
      },
      //error callback
      function(res){
        console.log('res:', res);
        if(res.status === 401){
          console.log('Login failed: unauthorized credentials.');
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
        console.log($scope.attemptedUsername, 'successfully signed up.');
        localStorage.setItem('user.username', $scope.attemptedUsername);
        $state.go('dashboard');
      },
      //error callback
      function(err){
        console.log('Login failed:', err);
        $scope.showUnauthMsg = true;
      }
    );
  };

}]);