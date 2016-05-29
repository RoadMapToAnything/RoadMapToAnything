angular.module('roadmaps.factory', [])

.factory('RoadmapsFactory', ['Server', 'User', function (Server, User) {

  var RoadmapsFactory = {};

  // Checks if a target object is in an array based on its _id
  var containsId = function(objects, target) {
    for (var i = 0; i < objects.length; i++) {
      if (objects[i]._id === target._id) return true;
    }
    return false;
  };

  RoadmapsFactory.truncate = function(str, max) {
    if (!str) return;

    str = str.replace('http://', '').replace('https://', '');
    return str.length < max ? str : str.slice(0, max) + '...';
  };

  RoadmapsFactory.isNodeCompleted = function(user, map, node) {
    if (!user || !map || !node) return false;

    if ( containsId(user.completedRoadmaps, map) ) return true;
    if ( containsId(user.inProgress.nodes, node) ) return true;

    return false;
  };

  // Is every node in a roadmap completed, but the roadmap isn't?
  RoadmapsFactory.isCompletedMapUntracked = function(user, map) {
    if (!user || !map) return false;

    if ( containsId(user.completedRoadmaps, map) ) return false;

    for (var i = 0; i < map.nodes.length; i++) {
      if ( !containsId(user.inProgress.nodes, map.nodes[i]) ) return false;
    }

    return true;
  };

  RoadmapsFactory.defaultNode = {
    resourceURL: 'Enter a URL to begin',
    title: 'Node Title',
    description: 'Write a short description here, or let us find one from the URL.'
  };

  return RoadmapsFactory;

}]);