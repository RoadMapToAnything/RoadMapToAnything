angular.module('app.common', [])

.factory('API', ['$http', function($http){
  var api = {};

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

  api.getUsers = function() {

    return $http.get('/api/users')
    .then(standardResponse)
    .catch(standardError);
  };

  api.getUserByUsername = function(username) {

    return $http.get('/api/users/' + username)
    .then(standardResponse)
    .catch(standardError);
  };

  api.getUser = api.getUserByUsername;

  api.updateUser = function(user) {

    return $http({
      method: 'PUT',
      url: '/api/users/' + user.username,
      data: user,
      headers: { Authorization: 'Basic ' + encodeAuthHeader() }
    })
    .then(standardResponse)
    .catch(standardError);
  };

  api.deleteUserByUsername = function(username) {

    return $http({
      method: 'PUT',
      url: '/api/users/' + user.username,
      headers: { Authorization: 'Basic ' + encodeAuthHeader() }
    })
    .then(standardResponse)
    .catch(standardError);
  };

  api.deleteUser = api.deleteUserByUsername;


  /* * * * * * * * * * * * * * * * * * * * * 
   *               ROADMAPS                *
   * * * * * * * * * * * * * * * * * * * * */

  api.getRoadmaps = function() {

    return $http.get('/api/roadmaps')
    .then(standardResponse)
    .catch(standardError);
  };

  api.getMaps = api.getRoadmaps;

  api.getRoadmapById = function(id) {

    return $http.get('/api/roadmaps/' + id)
    .then(standardResponse)
    .catch(standardError);
  };

  api.getRoadmap = api.getRoadmapById;
  api.getMap = api.getRoadmapById;

  api.createRoadmap = function(roadmap) {

   return $http({
      method: 'POST',
      url: '/api/roadmaps',
      data: roadmap,
      headers: { Authorization: 'Basic ' + encodeAuthHeader() }
    })
    .then(standardResponse)
    .catch(standardError);
  };

  api.createMap = api.createRoadmap;

  api.updateRoadmap = function(roadmap) {

    return $http({
      method: 'PUT',
      url: '/api/roadmaps/' + roadmap._id || roadmap.id,
      data: roadmap,
      headers: { Authorization: 'Basic ' + encodeAuthHeader() }
    })
    .then(standardResponse)
    .catch(standardError);
  };

  api.deleteRoadmapById = function(id) {

    return $http({
      method: 'DELETE',
      url: '/api/roadmaps/' + id,
      headers: { Authorization: 'Basic ' + encodeAuthHeader() }
    })
    .then(standardResponse)
    .catch(standardError);
  };

  api.deleteRoadmap = api.deleteRoadmapById;
  api.deleteMap = api.deleteRoadmapById;



  return api;

}]);