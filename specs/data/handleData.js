var User = require('../../server/api/users/userModel.js'),
    Roadmap = require('../../server/api/roadmaps/roadmapModel.js'),
    Node = require('../../server/api/nodes/nodeModel.js'),

    data = require('./testData.json'),
    users = data.users,
    maps = data.maps,
    nodes = data.nodes;


var checkItems = function(seed, db, next, fail) {

  var checkOne = function (i) {
    if (i >= seed.length) return next && next();

    db.findOne(seed[i]._id)
    .then(function (item) {
      if (!item) checkOne(i + 1);
      else if (fail) fail();
    });
  };

  checkOne(0);
};

module.exports.checkData = function(next, fail) {
  checkItems(users, User, function() {
    checkItems(maps, Roadmap, function() {
      checkItems(nodes, Node, function() {
        if (next) next();
      }, fail);
    }, fail);
  }, fail);
};


var seedItems = function(seed, db, next) {

  var seedOne = function(i) {
    if (i >= seed.length) return next && next();

    db(seed[i]).save()
      .then(function (node) {
        if (node) seed[i] = node;
        seedOne(i + 1);
      });
  };

  seedOne(0);
};

module.exports.seedData = function(next) {

  seedItems(users, User, function() {
    seedItems(maps, Roadmap, function() {
      seedItems(nodes, Node, function() {
        if (next) next([users, maps, nodes]);
      });
    });
  });
};


var clearItems = function(seed, db, next) {

  var clearOne = function(i) {
    if (i >= seed.length) return next && next();

    db.findOne(seed[i]._id)
      .then(function (item) {
        if (item) item.remove();
        clearOne(i + 1);
      });
  };

  clearOne(0);
};

module.exports.clearData = function(next) {

  clearItems(nodes, Node, function() {
    clearItems(maps, Roadmap, function() {
      clearItems(users, User, function() {

        Node.findOne(data.newNode._id)
        .then(function (node) {
          if (node) node.remove();
          return Roadmap.findOne(data.newMap._id);
        })
        .then(function (map) {
          if (map) map.remove();
          return User.findOne(data.newUser._id);
        })
        .then(function (user) {
          if (user) user.remove();
          if (next) next();
        });
      });
    });
  });
};