var User = require('./userModel.js'),
    handleError = require('../../util.js').handleError,
    handleQuery = require('../queryHandler.js');


module.exports = {

  createUser : function(req, res, next){
    var newUser = req.body;
    console.log('creating new user with', req.body);

    User(newUser).save()
      .then(function(createdUserResults){ 
        res.status(201).json(createdUserResults);
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
        else res.status(200).json(validUser); // TODO: send back a token, not DB results
      })
      .catch(handleError(next));
  },

  getUsers: function(req, res, next) {
    var dbArgs = handleQuery(req.query);

    User.find(dbArgs.filters, dbArgs.fields, dbArgs.params)
      .then(function (users) {
        if (!users) return res.sendStatus(401);
        res.status(200).json(users);
      })
      .catch(handleError(next));
  },

  getUserByName: function(req, res, next) {
    User.findOne({username: req.params.username})
      .then( function (user) {
        if (!user) return res.sendStatus(401); 
        res.status(200).json(user);
      })
      .catch(handleError(next));
  },

  updateUserByName: function(req, res, next) {
    User.findOneAndUpdate({username: req.params.username}, req.body)
      .then( function (user) {
        if (!user) return res.sendStatus(401); 
        res.status(200).json(user);
      })
      .catch(handleError(next));
  },

  deleteUserByName: function(req, res, next) {
    User.findOne({username: req.params.username})
      .then( function (user) {
        if (!user) return res.sendStatus(401);

        user.remove();
        console.log('deleted user with', req.params);
        res.status(201).json(user);
      })
      .catch(handleError(next));
  }
};

