angular.module('auth.ctrl', ['services.user'])

.controller('AuthController', ['$scope','$state', 'User', function($scope, $state, User){

  $scope.signin = true;
  $scope.showSignup = function (){
    $scope.signin = false;
    $scope.resetInputs();
  }
  $scope.showSignin = function (){
    $scope.signin = true;
    $scope.resetInputs();
  }
  $scope.resetInputs = function() {
    console.log("resetting inputs");
    $scope.attemptedFirstName = '';
    $scope.attemptedLastName = '';
    $scope.attemptedUsername = '';
    $scope.attemptedPassword = '';
  }
  $scope.resetInputs();

  $scope.showUnauthMsg = false;

  $scope.attemptLogin = function () {
    $scope.showUnauthMsg = false;
    $scope.signin = true;


    User.login($scope.attemptedUsername, $scope.attemptedPassword)
    .then(function (data) {
      $scope.resetInputs();
      $state.go('home.dashboard');
    })
    .catch(function (err) {
      if (err.status === 401) {
        $scope.resetInputs();
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
      $scope.resetInputs();
      $state.go('home.dashboard');
    })
    .catch(function (err) {
      $scope.resetInputs();
      console.log('Login failed:', err);
      $scope.showUnauthMsg = true;
    });
  };

}]);