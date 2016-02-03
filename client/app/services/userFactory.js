angular.module('services.user', ['services.server'])

.factory('User', ['$http', 'Server', function($http, Server){

  var User = {};

  /* * * * * * * * * * * * * * * * * * * * * 
   *           HELPER FUNCTIONS            *
   * * * * * * * * * * * * * * * * * * * * */

  // Standard response after for auth actions
  var authResponse = function (res, message) {
    console.log(res.data.data.username, message);
    localStorage.setItem('user.username', res.data.data.username);
    localStorage.setItem('user.authToken', res.data.data.authToken);
    return res.data.data;
  };

  var encodeAuthHeader = function() {
    var user = localStorage.getItem('user.username');
    var token = localStorage.getItem('user.authToken');
    return 'Basic ' + btoa(user + ':' + token);
  };

  var standardResponse = function(res) {
    console.log( '(' + res.status + ') ' + 
      res.config.method + ' successful for ' + 
      parseName(res) + ': ', res.data.data );

    return res.data.data;
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

  // Calculates user's progress toward completing one or many roadmaps
  var calcProgress = function(inProgress, id) {
    var maps = inProgress.roadmaps;
    var nodes = inProgress.nodes;
    var nodeCounts = {};
    var results = [];

    // If looking at one roadmap, narrow maps array to that
    if (id) {
      for (var i = 0; i < maps.length; i++) {
        if (maps[i]._id === id) maps = [maps[i]];
      }
    }

    nodes.forEach(function (node) {
      nodeCounts[node.parentRoadmap] = nodeCounts[node.parentRoadmap] + 1 || 1;
    });

    maps.forEach(function (map) {
      var completed = nodeCounts[map._id] || 0;
      var total = map.nodes.length;

      results.push({
        id: map._id,
        _id: map._id,
        completed: completed,
        total: total,
        percent: Math.floor(completed / total * 100)
      });
    });

    // If looking at one roadmap, return just that result, otherwise an array
    return id ? results[0] : results;
  };


  /* * * * * * * * * * * * * * * * * * * * * 
   *                BASIC                  *
   * * * * * * * * * * * * * * * * * * * * */

  User.getData = function() {
    return Server.getUser(localStorage.getItem('user.username'));
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
    return $http({
      method: 'PUT',
      url: '/api/roadmaps/' + id + '/follow',
      headers: { Authorization: encodeAuthHeader() }
    }).then(standardResponse);
  };

  User.unfollowRoadmapById = function(id) {
    return $http({
      method: 'PUT',
      url: '/api/roadmaps/' + id + '/unfollow',
      headers: { Authorization: encodeAuthHeader() }
    }).then(standardResponse);
  };

  User.completeNodeById = function(id) {
    return Server.updateUser({ 'inProgress.nodes': id });
  };

  User.completeRoadmapById = function(id) {
    return Server.updateUser({ 'completedRoadmaps': id });
  };

  // Accepts one or two possible parameters:
  //  id: returns progress for a single roadmap, otherwise returns all
  //  user: passing a user object allows serverless synchronus functionality
  User.getRoadmapProgress = function() {
    var id, user;
    for (var i = 0; i < arguments.length; i++) {
      if (typeof arguments[i] === 'string') id = arguments[i];
      if (typeof arguments[i] === 'object') user = arguments[i];
    }

    // If no user provided, user is fetched, and a promise is returned
    if (!user) {
      return User.getData()
      .then(function (user) {
        return calcProgress(user.inProgress, id);
      });

    } else {
      return calcProgress(user.inProgress, id);
    }
  };


  /* * * * * * * * * * * * * * * * * * * * * 
   *               ALIASES                 *
   * * * * * * * * * * * * * * * * * * * * */

  User.followMapById = User.followRoadmapById;
  User.followRoadmap = User.followRoadmapById;
  User.followMap = User.followRoadmapById;
  User.follow = User.followRoadmapById;
  User.unfollowMapById = User.unfollowRoadmapById;
  User.unfollowRoadmap = User.unfollowRoadmapById;
  User.unfollowMap = User.unfollowRoadmapById;
  User.unfollow = User.unfollowRoadmapById;

  User.completeNode = User.completeNodeById;
  User.completeRoadmap = User.completeRoadmapById;
  User.completeMap = User.completeRoadmapById;

  User.getMapProgress = User.getRoadmapProgress;
  User.getProgress = User.getRoadmapProgress;


  return User;

}]);