angular.module('auth.ctrl', ['services.user'])

.controller('AuthController', ['$scope','$state', 'User', function($scope, $state, User){

  $scope.attemptedFirstName = '';
  $scope.attemptedLastName = '';
  $scope.attemptedUsername = '';
  $scope.attemptedPassword = '';

  $scope.showUnauthMsg = false;

  $scope.attemptLogin = function () {
    $scope.showUnauthMsg = false;

    User.login($scope.attemptedUsername, $scope.attemptedPassword)
    .then(function (data) {
      $state.go('home.dashboard');
    })
    .catch(function (err) {
      if (err.status === 401) {
        console.log('(401) Login failed: bad credentials.');
        $scope.showUnauthMsg = true;
      }
    });
  };

  $scope.attemptSignup = function () {
    $scope.showUnauthMsg = false;

    User.signup({
      firstName: $scope.attemptedFirstName,
      lastName: $scope.attemptedLastName,
      username: $scope.attemptedUsername,
      password: $scope.attemptedPassword
    })
    .then(function (res) {
      $state.go('home.dashboard');
    })
    .catch(function (err) {
      console.log('Login failed:', err);
      $scope.showUnauthMsg = true;
    });
  };

}]);