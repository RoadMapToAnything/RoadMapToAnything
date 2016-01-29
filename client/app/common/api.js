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

  api.deleteUser = function(username) {

    return $http({
      method: 'PUT',
      url: '/api/users/' + user.username,
      data: user,
      headers: { Authorization: 'Basic ' + encodeAuthHeader() }
    })
    .then(standardResponse)
    .catch(standardError);
  };


  /* * * * * * * * * * * * * * * * * * * * * 
   *               ROADMAPS                *
   * * * * * * * * * * * * * * * * * * * * */

  api.saveRoadmap = function(roadmap) {

   return $http({
      method: 'POST',
      url: '/api/roadmaps',
      data: roadmap,
      headers: { Authorization: 'Basic ' + encodeAuthHeader() }
    })
    .then(standardResponse)
    .catch(standardError);
  };


  return api;

}]);