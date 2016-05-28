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
    console.log(node);
  };

  $scope.updateSelected = function() {
    Server.updateNode( $scope.selected );
  };

  $scope.scrapeSelected = function() {
    Server.scrape( $scope.selected.resourceURL )
    .then(function(data){

      for (var key in data) {
        if (data[key]) $scope.selected[key] = data[key];
      }
      
    });
  };

}]);
