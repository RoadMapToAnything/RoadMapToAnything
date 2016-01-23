angular.module('app.dash', [])

.controller('DashboardController', function($scope){
  $scope.test = function(){
    console.log('Dashboard controller is working');
  };
  $scope.test();
});