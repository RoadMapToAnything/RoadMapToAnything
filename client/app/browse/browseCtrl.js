angular.module('browse.ctrl', ['services.user', 'browse.factory'])

.controller('BrowseController', ['$scope', '$state', '$filter', 'User', 'Browse',  function($scope, $state, $filter, User, Browse){
  $scope.mapData = [];

  $scope.showSigninMsg = false;
  $scope.isLoggedIn = User.isLoggedIn;

  $scope.getMapData = Browse.getMapData;
  $scope.followMap = User.followMap;
  $scope.goToMap = Browse.goToMap;
  $scope.orderMaps = Browse.orderMaps;

  $scope.getMapData(function(mapData){
    $scope.mapData = mapData;
  });
  
  var orderBy = $filter('orderBy');

  $scope.order = function(predicate) {
      $scope.predicate = predicate;
      $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
      $scope.mapData = orderBy($scope.mapData, predicate, $scope.reverse);
    };
    $scope.order('bestRating', true);



  $scope.totalComments = function(commentsArray){
    $scope.total = 0;
    for(var i = 0; i < commentsArray.length; i++){
      $scope.total++;
    }
    return $scope.total;
  };

  $scope.goToDash = function() {
      $state.go('home.dashboard');
  };

  $scope.goToMap = function(mapID){
    $state.go('home.roadmapTemplate', { 'roadmapID': mapID });
  };

  $scope.upvote = function(roadmapId, index) {
    User.upvote(roadmapId)
    .then(function(roadmap) {
      $scope.mapData[index].upvotes = roadmap.upvotes;
      $scope.mapData[index].downvotes = roadmap.downvotes;
    });
  };

  $scope.downvote = function(roadmapId, index) {
    User.downvote(roadmapId)
    .then(function(roadmap) {
      $scope.mapData[index].upvotes = roadmap.upvotes;
      $scope.mapData[index].downvotes = roadmap.downvotes;
    });
  };

}]);
