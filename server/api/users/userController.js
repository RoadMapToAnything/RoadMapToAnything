var User = require('./userModel.js'),
    handleError = require('../../util.js').handleError,
    handleQuery = require('../queryHandler.js'),
    bcrypt = require('bcrypt-nodejs');

var populateFields = 'authoredRoadmaps.nodes inProgress.roadmaps.nodes inProgress.nodes completedRoadmaps.nodes';

module.exports = {

  createUser : function(req, res, next){
    var newUser = req.body;
    console.log('creating new user with', req.body);

    User(newUser).save()
      .then(function(createdUserResults){ 
        res.status(201).json({data: createdUserResults});
      })
      .catch(handleError(next));
  },

  login : function(req, res, next){
    console.log('req.body', req.body);
    console.log('username',req.query.username);
    console.log('username',req.query.password);
    var credentials = {
      username: req.query.username,
      password: req.query.password,
    };

    User.findOne(credentials)
      .then(function(validUser){
        if (!validUser) res.sendStatus(401);  // unauthorized: invalid credentials
        else {
          bcrypt.hash(validUser.password, null, null, function(err, hashedPassword){
            var encodedHash = new Buffer(hashedPassword, 'ascii').toString('base64');
            res.status(200).json({username: validUser.username, authToken: encodedHash });
          });
        }
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

