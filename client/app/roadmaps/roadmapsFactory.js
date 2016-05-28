angular.module('roadmaps.factory', [])

.factory('RoadmapsFactory', ['Server', function (Server) {

  var MapFactory = {};

  MapFactory.cropTitle = function(title) {
    return title.length < 12 ? title : title.slice(0, 12) + '...';
  };

  return MapFactory;

}]);