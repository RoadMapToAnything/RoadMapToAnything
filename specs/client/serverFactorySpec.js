// TODO: Turn the following into a real test

/*

var username = localStorage.getItem('user.username');

var updateUser = {
  username: username,
  firstName: 'Updated Name'
};

var newMap = {
  title: 'New Roadmap',
  description: 'I am a brand new roadmap!'
};

var newNode = {
  title: 'New Node',
  description: 'I am a brande new node!',
  resourceType: 'A Node'
};


Server.createRoadmap(newMap)
.then(function (map) {
  var mapId = map._id;
  var updateMap = {
    _id: mapId,
    title: 'Updated Title'
  };

  Server.getRoadmaps();
  Server.getMaps();
  Server.getRoadmapById(mapId);
  Server.getRoadmap(mapId);
  Server.getMap(mapId);
  Server.updateRoadmap(updateMap);
  Server.updateMap(updateMap);
  Server.deleteRoadmapById(mapId);
});

Server.createNode(newNode)
.then(function (node) {
  var nodeId = node._id;
  var updateNode = {
    _id: nodeId,
    title: 'Updated Title'
  };

  Server.getNodeById(nodeId);
  Server.getNode(nodeId);
  Server.updateNode(updateNode);

  Server.getUsers();
  Server.getUserByUsername(username);
  Server.getUser(username);
  Server.updateUser(updateUser);

  Server.deleteUserByUsername(username);
  Server.deleteNodeById(nodeId);
});

*/