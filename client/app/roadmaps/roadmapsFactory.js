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



  // Server.getRoadmapById = function(id) {

  //   return $http.get('/api/roadmaps/' + id)
  //   .then(standardResponse)
  //   .catch(standardError);
  // };


  // Server.createRoadmap = function(roadmap) {

  //  return $http({
  //     method: 'POST',
  //     url: '/api/roadmaps',
  //     data: roadmap,
  //     headers: { Authorization: 'Basic ' + encodeAuthHeader() }
  //   })
  //   .then(standardResponse)
  //   .catch(standardError);
  // };

  //   var standardResponse = function(res) {
  //   console.log( '(' + res.status + ') ' + 
  //     res.config.method + ' successful for ' + 
  //     parseName(res) + ': ', res.data.data );

  //   return res.data.data;
  // };

  // var standardError = function(err) {
  //   console.log( '(' + err.status + ') ' +
  //     err.config.method + ' failed for ' +
  //     parseName(err) + ': ', err.data );
  // };


    return {
      roadmapId: roadmapId,
      getRoadMap: getRoadMap  
    };
   });