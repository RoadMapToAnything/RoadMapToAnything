angular.module('roadmaps.ctrl', ['roadmaps.factory', 'services.server', 'services.user', 'scraper.ctrl'])

.controller('RoadmapsController', [ '$scope', '$stateParams', 'RoadmapsFactory', 'Server', 'User', '$timeout', '$state', function($scope, $stateParams, RoadmapsFactory, Server, User, $timeout, $state){  
  angular.extend($scope, RoadmapsFactory);

  // Fetch the roadmap from the server and attach it to $scope
  Server.getMap($stateParams.roadmapID)
  .then(function(map) {
    $scope.map = map;
  });

  $scope.selectNode = function(node) {
    $scope.selected = node;
  };

}]);
