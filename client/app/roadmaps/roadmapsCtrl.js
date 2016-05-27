angular.module('roadmaps.ctrl', ['roadmaps.factory', 'services.server', 'services.user', 'scraper.ctrl'])

.controller('RoadmapsController', [ '$scope', '$stateParams', 'RoadmapsFactory', 'Server', 'User', '$timeout', '$state', function($scope, $stateParams, RoadmapsFactory, Server, User, $timeout, $state){  
  angular.extend($scope, RoadmapsFactory);


}]);
