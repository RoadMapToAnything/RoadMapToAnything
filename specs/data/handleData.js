var User = require('../../server/api/users/userModel.js'),
    Roadmap = require('../../server/api/roadmaps/roadmapModel.js'),
    Node = require('../../server/api/nodes/nodeModel.js'),

    data = require('./testData.json'),
    users = data.users,
    maps = data.maps,
    nodes = data.nodes;


var seedUsers = function(next) {

  var addUser = function(i) {
    if (i >= users.length) return next && next();

    User(users[i]).save()
      .then(function (user) {
        if (user) users[i] = user;
        addUser(i + 1);
      });
  };

  addUser(0);
};


var clearUsers = function(next) {

  var removeUser = function(i) {
    if (i >= users.length) return next && next();

    User.findOne(users[i].username)
      .then(function (user) {
        if (user) user.remove();
        removeUser(i + 1);
      });
  };

  removeUser(0);
};


var seedRoadmaps = function(next) {

  var addRoadmap = function(i) {
    if (i >= maps.length) return next && next();

    maps[i].author = users[maps[i].author]._id;


    Roadmap(maps[i]).save()
      .then(function (map) {
        if (map) maps[i] = map;
        addRoadmap(i + 1);
      });
  };

  addRoadmap(0);
};


var clearRoadmaps = function(next) {

  var removeRoadmap = function(i) {
    if (i >= maps.length) return next && next();

    Roadmap.findOne(maps[i]._id)
      .then(function (map) {
        if (map) map.remove();
        removeRoadmap(i + 1);
      });
  };

  removeRoadmap(0);
};


var seedNodes = function(next) {

  var addNode = function(i) {
    if (i >= nodes.length) return next && next();

    nodes[i].parentRoadmap = maps[nodes[i].parentRoadmap]._id;

    Node(nodes[i]).save()
      .then(function (node) {
        if (node) nodes[i] = node;
        addNode(i + 1);
      });
  };

  addNode(0);
};

var clearNodes = function(next) {

  var removeNode = function(i) {
    if (i >= nodes.length) return next && next();

    Node.findOne(nodes[i]._id)
      .then(function (node) {
        if (node) node.remove();
        removeNode(i + 1);
      });
  };

  removeNode(0);
};


module.exports.checkData = function(next, fail) {

  var checkUser = function (i) {
    if (i >= nodes.length) return next && next();

    User.findOne(users[i].username)
      .then(function (user) {
        if (!user) checkUser(i + 1);
        else if (fail) fail();
      });
  };

  checkUser(0);
};


module.exports.seedData = function(next) {

  seedUsers(function() {
    seedRoadmaps(function() {
      seedNodes(function() {
        console.log('Seeded DB with test data:');
        console.log(users);
        console.log(maps);
        console.log(nodes);
        if (next) next();
      });
    });
  });
};


module.exports.clearData = function(next) {

  clearNodes(function() {
    clearRoadmaps(function() {
      clearUsers(function() {
        if (next) next();
      });
    });
  });
};