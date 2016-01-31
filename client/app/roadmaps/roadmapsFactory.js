//roadmap factory

angular.module('roadmaps.factory', [])

  .factory('RoadMapsFactory', function($http){

    var roadmapId = localStorage.getItem('roadmap.id') || '000000000000000000000010';
    // var username = localStorage.getItem('user.username') || 'bowieloverx950';
    // var nodeId = currentNode._id;
    // var currentRoadMapData = {};
    // var renderedNodes = [];

    // Fetch data for the current roadmap by id from the server.
    var getRoadMap = function() {
       return $http({
          method: 'GET',
          url: '/api/roadmaps/' + roadmapId
        })
    };

    return {
      roadmapId: roadmapId,
      getRoadMap: getRoadMap  
    };
   });