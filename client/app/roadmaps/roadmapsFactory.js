angular.module('roadmaps.factory', [])

.factory('RoadmapsFactory', ['Server', 'User', function (Server, User) {

  var MapFactory = {};

  MapFactory.truncate = function(str, max) {
    if (!str) return;

    str = str.replace('http://', '').replace('https://', '');
    return str.length < max ? str : str.slice(0, max) + '...';
  };

  MapFactory.isCompleted = function(user, map, node) {
    if (!user) return false;

    for (var i = 0; i < user.completedRoadmaps.length; i++) {
      if (map._id = user.completedRoadmaps[i]._id) return true;
    }

    for (var j = 0; j < user.inProgress.nodes.length; j++) {
      if (node._id === user.inProgress.nodes[j]._id) return true;
    }

    return false;
  };

  MapFactory.defaultNode = {
    resourceURL: 'Enter a URL to begin',
    title: 'New Node',
    description: ' I am a short description'
  };

  return MapFactory;

}]);