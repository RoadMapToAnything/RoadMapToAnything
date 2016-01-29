angular.module('app.common', [])

.factory('API', ['$http', function($http){
  var API = {};

  var encodeAuthHeader = function() {
    var user = localStorage.getItem('user.username');
    var token = localStorage.getItem('user.authToken');
    return btoa(user + ':' + token);
  };

  var standardResponse = function(res) {
    var nameKeys = ['title', 'username'];
    var name;

    // Grab the name of the item affected from response
    nameKeys.forEach(function (key) {
      if (res.data.data[key]) name = res.data.data[key];
    });

    console.log(res.status, '-', 
      res.config.method, 'successful for', 
      name, ':', res.data.data);

    return res.data.data;
  };

  var standardError = function(err) {
    console.log(err);
  };


  /* * * * * * * * * * * * * * * * * * * * * 
   *                 USERS                 *
   * * * * * * * * * * * * * * * * * * * * */

  API.getUsers = function() {

    return $http.get('/api/users')
    .then(standardResponse)
    .catch(standardError);
  };

  API.getUserByUsername = function(username) {

    return $http.get('/api/users/' + username)
    .then(standardResponse)
    .catch(standardError);
  };

  API.updateUser = function(user) {

    return $http({
      method: 'PUT',
      url: '/api/users/' + user.username,
      data: user,
      headers: { Authorization: 'Basic ' + encodeAuthHeader() }
    })
    .then(standardResponse)
    .catch(standardError);
  };

  API.deleteUserByUsername = function(username) {

    return $http({
      method: 'PUT',
      url: '/api/users/' + user.username,
      headers: { Authorization: 'Basic ' + encodeAuthHeader() }
    })
    .then(standardResponse)
    .catch(standardError);
  };


  /* * * * * * * * * * * * * * * * * * * * * 
   *               ROADMAPS                *
   * * * * * * * * * * * * * * * * * * * * */

  API.getRoadmaps = function() {

    return $http.get('/api/roadmaps')
    .then(standardResponse)
    .catch(standardError);
  };

  API.getRoadmapById = function(id) {

    return $http.get('/api/roadmaps/' + id)
    .then(standardResponse)
    .catch(standardError);
  };

  API.createRoadmap = function(roadmap) {

   return $http({
      method: 'POST',
      url: '/api/roadmaps',
      data: roadmap,
      headers: { Authorization: 'Basic ' + encodeAuthHeader() }
    })
    .then(standardResponse)
    .catch(standardError);
  };

  API.updateRoadmap = function(roadmap) {

    return $http({
      method: 'PUT',
      url: '/api/roadmaps/' + roadmap._id || roadmap.id,
      data: roadmap,
      headers: { Authorization: 'Basic ' + encodeAuthHeader() }
    })
    .then(standardResponse)
    .catch(standardError);
  };

  API.deleteRoadmapById = function(id) {

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

  API.getNodeById = function(id) {

    return $http.get('/api/nodes/' + id)
    .then(standardResponse)
    .catch(standardError);
  };

  API.createNode = function(node) {

   return $http({
      method: 'POST',
      url: '/api/nodes',
      data: node,
      headers: { Authorization: 'Basic ' + encodeAuthHeader() }
    })
    .then(standardResponse)
    .catch(standardError);
  };

  API.updateNode = function(node) {

    return $http({
      method: 'PUT',
      url: '/api/nodes/' + node._id || node.id,
      data: node,
      headers: { Authorization: 'Basic ' + encodeAuthHeader() }
    })
    .then(standardResponse)
    .catch(standardError);
  };

  API.deleteNodeById = function(id) {

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

  API.getUser = API.getUserByUsername;
  API.deleteUser = API.deleteUserByUsername;

  API.getMaps = API.getRoadmaps;
  API.getRoadmap = API.getRoadmapById;
  API.getMap = API.getRoadmapById;
  API.createMap = API.createRoadmap;
  API.deleteRoadmap = API.deleteRoadmapById;
  API.deleteMap = API.deleteRoadmapById;

  API.getNode = API.getNodeById;
  API.deleteNode = API.deleteNodeById; 

  return API;

}]);