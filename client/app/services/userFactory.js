angular.module('services.user', ['services.server'])

.factory('User', ['$http', 'Server', function($http, Server){

  var User = {};

  // Standard response after for auth actions
  var authResponse = function (res, message) {
    console.log(res.data.data.username, message);
    localStorage.setItem('user.username', res.data.data.username);
    localStorage.setItem('user.authToken', res.data.data.authToken);
    return res.data.data;
  };


  /* * * * * * * * * * * * * * * * * * * * * 
   *                 AUTH                  *
   * * * * * * * * * * * * * * * * * * * * */

  User.login = function(username, password) {
    return $http({
      method: 'GET',
      url: '/api/login',
      params: {
        username: username,
        password: password
      }
    })
    .then(function (res) {
      return authResponse(res, 'successfully logged in.');
    });
  };

  User.signup = function(user) {
    return $http.post('/api/signup', user)
    .then(function (res) {
      return authResponse(res, 'successfully signed up.');
    });
  };

  User.logout = function() {
    var username = localStorage.getItem('user.username');
    localStorage.removeItem('user.username');
    localStorage.removeItem('user.authToken');
    console.log(username, 'successfully logged out.');
  };

  User.isLoggedIn = function() {
    return !!localStorage.getItem('user.authToken');
  };


  /* * * * * * * * * * * * * * * * * * * * * 
   *               PROGRESS                *
   * * * * * * * * * * * * * * * * * * * * */

  User.followRoadmapById = function(id) {
    return Server.updateUser({ 'inProgress.roadmaps': id });
  };

  User.unfollowRoadmapById = function(id) {
    // TODO: Enable unfollowing roadmaps.
  };

  User.completeNodeById = function(id) {
    return Server.updateUser({ 'inProgress.nodes': id });
  };

  User.completeRoadmapById = function(id) {
    return Server.updateUser({ 'completedRoadmaps': id });
  };


  /* * * * * * * * * * * * * * * * * * * * * 
   *               ALIASES                 *
   * * * * * * * * * * * * * * * * * * * * */

  User.followRoadmap = User.followRoadmapById;
  User.followMap = User.followRoadmapById;
  User.unfollowRoadmap = User.unfollowRoadmapById;
  User.unfollowMap = User.unfollowRoadmapById;

  User.completeNode = User.completeNodeById;
  User.completeRoadmap = User.completeRoadmapById;
  User.completeMap = User.completeRoadmapById;


  return User;

}]);