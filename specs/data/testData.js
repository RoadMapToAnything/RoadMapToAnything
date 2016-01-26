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
    author     : 0, // This # will be replaced with the _id of users[#]
    nodes      : []
  },

  {
    title      : 'Learning JavaScript',
    description: '134rn 2 b 4n 1337 h4xx0rz',
    author     : 1,
    nodes      : []
  },

  {
    title      : 'Straight Outta Knowing Nothing About Straight Outta Compton',
    description: 'Your hip hop history. Learn it.',
    author     : 2,
    nodes      : []
  }
];

var nodes = [
  {
    title        : 'Watch Life On Mars?',
    description  : 'Watch this classic. Absorb the Bowie.',
    resourceType : 'Music Video',
    resourceURL  : 'https://www.youtube.com/watch?v=v--IqqusnNQ',
    parentRoadmap: 0 // This # will be replaced with the _id of maps[#]
  },

  {
    title        : 'Take Codecademy\'s Intro Course',
    description  : 'OMG 1f u c4nt h4x th15 w4t h0p d0 u h4v???',
    resourceType : 'Online Course',
    resourceURL  : 'https://www.codecademy.com/learn/javascript',
    parentRoadmap: 1
  },

  {
    title        : 'Watch Straight Outta Compton',
    description  : 'It\'s in the name. Watch it.',
    resourceType : 'Music Video',
    resourceURL  : 'https://www.youtube.com/watch?v=TMZi25Pq3T8',
    parentRoadmap: 2
  }
];


module.exports.users = users;
module.exports.maps = maps;
module.exports.nodes = nodes;


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

module.exports.seedData = function(next) {
  var log = function () {
    console.log('Seeded DB with test data:');
    console.log(users);
    console.log(maps);
    console.log(nodes);
    if (next) next();
  };

  User.findOne({username: users[0].username})
    .then(function (user) {
      if (!user)
        seedUsers( seedRoadmaps.bind( null, seedNodes.bind(null, log) ) );
      else if (next) next();
    });
};

module.exports.clearData = function(next) {
  clearNodes( clearRoadmaps.bind( null, clearUsers.bind(null, next) ) );
};