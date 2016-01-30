angular.module('browse.ctrl', ['services.user', 'services.server', 'services.browse'])

.controller('BrowseController', ['$scope', '$http', '$state', '$timeout', 'User', 'Server', 'Browse',  function($scope, $http, $state, $timeout, User, Server, Browse){
  $scope.mapData = [];

  $scope.showSigninMsg = false;
  $scope.isLoggedIn = User.isLoggedIn;

  $scope.addTotalNodesOfMaps = Browse.addTotalNodesOfMaps;
  $scope.getMapData = Browse.getMapData;
  $scope.addMapToEmbarked = Browse.addMapToEmbarked;
  $scope.goToMap = Browse.goToMap;

  $scope.getMapData(function(mapData){
    $scope.mapData = mapData;
  });




  $scope.goToDash = function () {
      $state.go('dashboard');

  $scope.goToMap = function (mapID){
    $state.go('home.roadmapTemplate', { 'roadmapID': mapID });
  };

  

}]);
