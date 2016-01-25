var User = require('../../server/api/users/userModel.js'),
    Roadmap = require('../../server/api/roadmaps/roadmapModel.js'),
    Node = require('../../server/api/nodes/nodeModel.js');

var users = [
  {
    username : 'bowieloverx950',
    password : 'c',
    firstName: 'Bob',
    lastName : 'Johnson',
    roadmaps : []
  },

  {
    username : 'supercoder31337', 
    password : 'a',
    firstName: 'Susan',
    lastName : 'Kozlowski',
    roadmaps : []
  },

  {
    username : 'alex<3hiphop', 
    password : 'b',
    firstName: 'Alejandro',
    lastName : 'Bautista',
    roadmaps : []
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


module.exports.users = users;
module.exports.maps = maps;
module.exports.nodes = nodes;


module.exports.seedUsers = function(next) {

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


module.exports.clearUsers = function(next) {

  var clearUser = function(i) {
    if (i >= users.length) return next && next();

    User.findOne(users[i].username)
      .then(function (user) {
        if (user) user.remove();
        clearUser(i + 1);
      });
  };

  clearUser(0);
};


module.exports.seedData = function(next) {

  var addRoadmap = function(i) {
    if (i >= maps.length) return next && next();

    maps[i].author = users[i]._id;

    Roadmap(maps[i]).save()
      .then(function (map) {
        if (map) maps[i] = map;

        User.findOneAndUpdate({_id: users[i]._id}, {roadmaps: map._id})
        .then(function () {
          addRoadmap(i + 1);
        });
      });
  };

  module.exports.seedUsers(addRoadmap.bind(null, 0));
};


module.exports.clearData = function(next) {

  var clearRoadmap = function(i) {
    if (i >= maps.length) return next && next();

    Roadmap.findOne(maps[i]._id)
      .then(function (map) {
        if (map) map.remove();
        clearRoadmap(i + 1);
      });
  };

  module.exports.clearUsers(clearRoadmap.bind(null, 0));
};