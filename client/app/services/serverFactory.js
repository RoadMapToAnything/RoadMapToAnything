angular.module('services.server', [])

.factory('Server', ['$http', function($http){
  var Server = {};

  var encodeAuthHeader = function() {
    var user = localStorage.getItem('user.username');
    var token = localStorage.getItem('user.authToken');
    return btoa(user + ':' + token);
  };

  var standardResponse = function(res) {
    console.log( '(' + res.status + ') ' + 
      res.config.method + ' successful for ' + 
      parseName(res) + ': ', res.data.data );

    return res.data.data;
  };

  var standardError = function(err) {
    console.log( '(' + err.status + ') ' +
      err.config.method + ' failed for ' +
      parseName(err) + ': ', err.data );
  };

  // Parses a name to be logged by responses and errors
  var parseName = function(res) {
    var nameKeys = ['title', 'username'];
    var name;

    // Grab the name of the item affected from response
    if (res.data.data) {
      nameKeys.forEach(function (key) {
        if (res.data.data[key]) name = res.data.data[key];
      });
    }

    // If name cannot be pulled from response, pull from url
    if (!name) name = res.config.url.split('/')[2];

    return name;
  };


  /* * * * * * * * * * * * * * * * * * * * * 
   *                 USERS                 *
   * * * * * * * * * * * * * * * * * * * * */

  Server.getUsers = function() {

    return $http.get('/api/users')
    .then(standardResponse)
    .catch(standardError);
  };

  Server.getUserByUsername = function(username) {

    return $http.get('/api/users/' + username)
    .then(standardResponse)
    .catch(standardError);
  };

  Server.updateUser = function(user) {
    user.username = localStorage.getItem('user.username');

    return $http({
      method: 'PUT',
      url: '/api/users/' + user.username,
      data: user,
      headers: { Authorization: 'Basic ' + encodeAuthHeader() }
    })
    .then(standardResponse)
    .catch(standardError);
  };

  Server.deleteUserByUsername = function(username) {

    return $http({
      method: 'PUT',
      url: '/api/users/' + username,
      headers: { Authorization: 'Basic ' + encodeAuthHeader() }
    })
    .then(standardResponse)
    .catch(standardError);
  };


  /* * * * * * * * * * * * * * * * * * * * * 
   *               ROADMAPS                *
   * * * * * * * * * * * * * * * * * * * * */

  Server.getRoadmaps = function(optionalSortQuery) {
    if (optionalSortQuery){
      return $http.get('/api/roadmaps' + optionalSortQuery)
      .then(standardResponse)
      .catch(standardError);  
    } else {
      return $http.get('/api/roadmaps')
      .then(standardResponse)
      .catch(standardError);  
    }
    
  };

  Server.getRoadmapById = function(id) {

    return $http.get('/api/roadmaps/' + id)
    .then(standardResponse)
    .catch(standardError);
  };

  Server.createRoadmap = function(roadmap) {

   return $http({
      method: 'POST',
      url: '/api/roadmaps',
      data: roadmap,
      headers: { Authorization: 'Basic ' + encodeAuthHeader() }
    })
    .then(standardResponse)
    .catch(standardError);
  };

  Server.updateRoadmap = function(roadmap) {

    return $http({
      method: 'PUT',
      url: '/api/roadmaps/' + roadmap._id || roadmap.id,
      data: roadmap,
      headers: { Authorization: 'Basic ' + encodeAuthHeader() }
    })
    .then(standardResponse)
    .catch(standardError);
  };

  Server.deleteRoadmapById = function(id) {

    return $http({
      method: 'DELETE',
      url: '/api/roadmaps/' + id,
      headers: { Authorization: 'Basic ' + encodeAuthHeader() }
    })
    .then(standardResponse)
    .catch(standardError);
  };


  /* * * * * * * * * * * * * * * * * * * * * 
   *                 NODES                 *
   * * * * * * * * * * * * * * * * * * * * */

  Server.getNodeById = function(id) {

    return $http.get('/api/nodes/' + id)
    .then(standardResponse)
    .catch(standardError);
  };

  Server.createNode = function(node) {
    console.log('server factory creating node', node);
   return $http({
      method: 'POST',
      url: '/api/nodes',
      data: node,
      headers: { Authorization: 'Basic ' + encodeAuthHeader() }
    })
    .then(standardResponse)
    .catch(standardError);
  };

  Server.updateNode = function(node) {

    return $http({
      method: 'PUT',
      url: '/api/nodes/' + node._id || node.id,
      data: node,
      headers: { Authorization: 'Basic ' + encodeAuthHeader() }
    })
    .then(standardResponse)
    .catch(standardError);
  };

  Server.deleteNodeById = function(id) {

    return $http({
      method: 'DELETE',
      url: '/api/nodes/' + id,
      headers: { Authorization: 'Basic ' + encodeAuthHeader() }
    })
    .then(standardResponse)
    .catch(standardError);
  };


  /* * * * * * * * * * * * * * * * * * * * * 
   *               ALIASES                 *
   * * * * * * * * * * * * * * * * * * * * */

  Server.getUser = Server.getUserByUsername;
  Server.deleteUser = Server.deleteUserByUsername;

  Server.getMaps = Server.getRoadmaps;
  Server.getMapById = Server.getRoadmapById;
  Server.getRoadmap = Server.getRoadmapById;
  Server.getMap = Server.getRoadmapById;
  Server.createMap = Server.createRoadmap;
  Server.updateMap = Server.updateRoadmap;
  Server.deleteRoadmap = Server.deleteRoadmapById;
  Server.deleteMap = Server.deleteRoadmapById;

  Server.getNode = Server.getNodeById;
  Server.deleteNode = Server.deleteNodeById; 

  return Server;

}]);