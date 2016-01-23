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

var roadmaps = [
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


module.exports.seedUsers = function(done) {
  User(users[0]).save()
    .then(function (user) {
      if (user) users[0] = user;

      User(users[1]).save()
        .then(function (user) {
          if (user) users[1] = user;

          User(users[2]).save()
            .then(function (user) {
              if (user) users[2] = user;

              if (done) done();
            });
        });
    });
};


module.exports.clearUsers = function(done) {
    User.findOne( {username: users[0].username} )
      .then(function (user) {
        if (user) user.remove();
      });

    User.findOne( {username: users[1].username} )
      .then(function (user) {
        if (user) user.remove();
      });

    User.findOne( {username: users[2].username} )
      .then(function (user) {
        if (user) user.remove();
        if (done) done();
      });
};
