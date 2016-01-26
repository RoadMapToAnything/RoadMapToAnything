angular.module('app.auth', [])

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
        console.log('sent login credentials');
        console.log('res.data', res.data);
        $state.go('dashboard', {url: '/dashboard' + res.data.username});
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
        console.log('sent signup credentials');
        console.log('res.data', res.data);
        $state.go('dashboard', {url: '/dashboard' + res.data.username});
      },
      //error callback
      function(res){
        console.log('sent signup credentials, failed at server');
        console.log('res.data', res.data);
        $scope.showUnauthMsg = true;
      }
    );
  };
  
}]);