angular.module('auth.ctrl', ['services.user'])

.controller('AuthController', ['$scope','$state', 'User', '$timeout', function($scope, $state, User, $timeout){

  $scope.signin = true;
  $scope.showSignup = function (){
    $scope.signin = false;
    resetInputs();
  }
  $scope.showSignin = function (){
    $scope.signin = true;
    resetInputs();
  }
  function resetInputs () {
    $scope.attemptedFirstName = '';
    $scope.attemptedLastName = '';
    $scope.attemptedUsername = '';
    $scope.attemptedPassword = '';
  }
  resetInputs();

  $scope.showUnauthMsg = false;
  $scope.showSigninFailMsg = false;

  $scope.attemptLogin = function () {
    $scope.showUnauthMsg = false;
    $scope.signin = true;
    console.log('attempting login');

    User.login($scope.attemptedUsername, $scope.attemptedPassword)
    .then(function (data) {
      resetInputs();
      $('.button-collapse').sideNav('hide');
      $('#auth-modal').closeModal();
      $('.lean-overlay').remove();
      $state.go('home.dashboard');
    })
    .catch(function (err) {
      console.log('error', err);
        resetInputs();
        console.log('(401) Login failed: bad credentials.');
        $scope.showUnauthMsg = true;
        $timeout(function(){
          $scope.showUnauthMsg = false;
        }, 5000);
    });
  };

  $scope.attemptSignup = function () {
    $timeout(function(){
      $scope.showSigninFailMsg = true;
    }, 2000);
    $timeout(function(){
      $scope.showSigninFailMsg = false;
    }, 6000);

    User.signup({
      firstName: $scope.attemptedFirstName,
      lastName: $scope.attemptedLastName,
      username: $scope.attemptedUsername,
      password: $scope.attemptedPassword
    })
    .then(function (res) {
      $scope.showSigninFailMsg = false
      $scope.signin = true;
      resetInputs();
      $('#auth-modal').closeModal();
      $('.lean-overlay').remove();
      $('.button-collapse').sideNav('hide');
      $state.go('home.dashboard');
    })
    .catch(function (err) {
      resetInputs();
      console.log('Login failed:', err);
    });
  };

}]);