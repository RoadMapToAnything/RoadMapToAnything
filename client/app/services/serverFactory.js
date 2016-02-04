angular.module('services.server', ['services.request'])

.factory('Server', ['Request', function (Request) {

  var Server = {};

  /* * * * * * * * * * * * * * * * * * * * * 
   *                 USERS                 *
   * * * * * * * * * * * * * * * * * * * * */

  // Retrieves an array of users with an optional query string parameter
  Server.getUsers = function(query) {
    return Request.get('/api/users', query);
  };

  Server.getUserByUsername = function(username) {
    return Request.get('/api/users/' + username);
  };

  Server.updateUser = function(user) {
    user.username = localStorage.getItem('user.username');

    return Request.put('/api/users/' + user.username, user);
  };

  Server.deleteUserByUsername = function(username) {
    return Request.delete('/api/users/' + username);
  };


  /* * * * * * * * * * * * * * * * * * * * * 
   *               ROADMAPS                *
   * * * * * * * * * * * * * * * * * * * * */

  // Retrieves an array of roadmaps with an optional query string parameter
  Server.getRoadmaps = function(query) {
    return Request.get('/api/roadmaps', query);
  };

  Server.getRoadmapById = function(id) {
    return Request.get('/api/roadmaps/' + id);
  };

  Server.createRoadmap = function(roadmap) {
    return Request.post('/api/roadmaps', roadmap, {auth: true});
  };

  Server.updateRoadmap = function(roadmap) {
    return Request.put('/api/roadmaps/' + roadmap._id, roadmap);
  };

  Server.deleteRoadmapById = function(id) {
    return Request.delete('/api/roadmaps/' + id);
  };


  /* * * * * * * * * * * * * * * * * * * * * 
   *                 NODES                 *
   * * * * * * * * * * * * * * * * * * * * */

  Server.getNodeById = function(id) {
    return Request.get('/api/nodes/' + id);
  };

  Server.createNode = function(node) {
    return Request.post('/api/nodes', node);
  };

  Server.updateNode = function(node) {
    return Request.put('/api/nodes/' + node._id, node);
  };

  Server.deleteNodeById = function(id) {
    return Request.delete('/api/nodes/' + id);
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
  Server.deleteMapById = Server.deleteRoadmapById;
  Server.deleteRoadmap = Server.deleteRoadmapById;
  Server.deleteMap = Server.deleteRoadmapById;

  Server.getNode = Server.getNodeById;
  Server.deleteNode = Server.deleteNodeById; 

  return Server;

}]);