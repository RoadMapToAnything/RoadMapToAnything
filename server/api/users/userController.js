var User = require('./userModel.js'),
    Promise = require('bluebird'),
    handleError = require('../../util.js').handleError,
    handleQuery = require('../queryHandler.js'),
    bcrypt = require('bcrypt-nodejs');

bcrypt.hash = Promise.promisify(bcrypt.hash); // Promise.promisifyAll did not work

var populateFields = 'authoredRoadmaps.nodes inProgress.roadmaps.nodes inProgress.nodes completedRoadmaps.nodes';

var hashPassword = function (user) {
  return [ user, bcrypt.hash(user.password, null, null) ];
};

var generateAuthToken = function (user, hashedPassword) {
  var encodedHash = new Buffer(hashedPassword, 'ascii').toString('base64');
  return {
    username: user.username,
    authToken: encodedHash
  };
};

module.exports = {

  createUser : function(req, res, next){
    var newUser = req.body;

    User(newUser).save()
      .then( hashPassword )
      .spread( generateAuthToken )
      .then(function(results){
        res.status(201).json({data: results});
      })
      .catch(handleError(next));
  },

  login : function(req, res, next){
    var credentials = {
      username: req.query.username,
      password: req.query.password,
    };

    User.findOne(credentials)
      .then(function(validUser){
        if (!validUser) res.sendStatus(401);  // unauthorized: invalid credentials
        else return hashPassword(validUser);
      })
      .spread(generateAuthToken)
      .then(function(results){
        res.status(200).json({data: results});
      })
      .catch(handleError(next));
  },

  getUsers: function(req, res, next) {
    var dbArgs = handleQuery(req.query);

    User.find(dbArgs.filters, dbArgs.fields, dbArgs.params)
      .deepPopulate(populateFields)
      .then(function (users) {
        if (!users) return res.sendStatus(401);
        res.status(200).json({data: users});
      })
      .catch(handleError(next));
  },

  getUserByName: function(req, res, next) {
    User.findOne({username: req.params.username})
      .deepPopulate(populateFields)
      .then( function (user) {
        if (!user) return res.sendStatus(401); 
        res.status(200).json({data: user});
      })
      .catch(handleError(next));
  },

  updateUserByName: function(req, res, next) {
    User.findOneAndUpdate({username: req.params.username}, req.body, {new: true})
      .deepPopulate(populateFields)
      .then( function (user) {
        if (!user) return res.sendStatus(401); 
        res.status(200).json({data: user});
      })
      .catch(handleError(next));
  },

  deleteUserByName: function(req, res, next) {
    User.findOne({username: req.params.username})
      .deepPopulate(populateFields)
      .then( function (user) {
        if (!user) return res.sendStatus(401);

        user.remove();
        console.log('deleted user with', req.params);
        res.status(201).json({data: user});
      })
      .catch(handleError(next));
  }
};

