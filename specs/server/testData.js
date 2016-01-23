var User = require('../../server/api/users/userModel.js'),
    Roadmap = require('../../server/api/roadmaps/roadmapModel.js'),
    Node = require('../../server/api/nodes/nodeModel.js');

var users = [
  {
    username: 'Bob',
    password: 'c',
    roadmaps: []
  },

  {
    username: 'Susan', 
    password: 'a',
    roadmaps: []
  },

  {
    username: 'Alejandro', 
    password: 'b',
    roadmaps: []
  }
];

var maps = [
  {
    title      : 'Understanding Bowie',
    description: 'This roadmap will help you learn about David Bowie',
    nodes      : []
  },

  {
    title      : 'Learning JavaScript',
    description: '134rn 2 b 4n 1337 h4xx0rz',
    nodes      : []
  },

  {
    title      : 'Straight Outta Knowing Nothing About Straight Outta Compton',
    description: 'Your hip hop history. Learn it.',
    nodes      : []
  }
];

var nodes = [
  {
    title        : 'Watch Life On Mars?',
    description  : 'Watch this classic. Absorb the Bowie.',
    resourceType : 'Music Video',
    resourceURL  : 'https://www.youtube.com/watch?v=v--IqqusnNQ',
    parentRoadmap: []
  },

  {
    title        : 'Take Codecademy\'s Intro Course',
    description  : 'OMG 1f u c4nt h4x th15 w4t h0p d0 u h4v???',
    resourceType : 'Online Course',
    resourceURL  : 'https://www.codecademy.com/learn/javascript',
    parentRoadmap: []
  },

  {
    title        : 'Watch Straight Outta Compton',
    description  : 'It\'s in the name. Watch it.',
    resourceType : 'Music Video',
    resourceURL  : 'https://www.youtube.com/watch?v=TMZi25Pq3T8',
    parentRoadmap: []
  }
];


module.exports.seedUsers = function(next) {

  var addUser = function(i) {
    if (i >= users.length) return next();

    User(users[i]).save()
      .then(function (user) {
        if (user) users[i] = user;
        addUser(i + 1);
      });
  };

  addUser(0);
};


module.exports.clearUsers = function(next) {

  users.forEach(function (user) {
    User.findOne(user)
      .then(function (user) {
        if (user) user.remove();
      });
  });

  if (next) next();
};


module.exports.seedData = function(next) {

  var addRoadmap = function(i) {
    if (i >= maps.length) return next();

    maps[i].author = users[i]._id;
    Roadmap(maps[i]).save()
      .then(function (map) {
        if (map) maps[i] = map;
        addRoadmap(i + 1);
        if (next) next();
      });
  };

  module.exports.seedUsers(addRoadmap(0));
};


module.exports.clearData = function(next) {

  module.exports.clearUsers();

  maps.forEach(function (map) {
    Roadmap.findOne(map)
      .then(function (map) {
        if (map) map.remove();
      });
  });

  if (next) next();
};
