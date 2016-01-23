var User = require('./userModel.js');
var handleQuery = require('../queryHandler.js');
//user controller methods

module.exports = {

  createUser : function(req, res, next){
    var newUser = req.body;

    User(newUser).save()
      .then(function(createdUserResults){ 
        res.status(201).json(createdUserResults);
      })
      .catch(function(err){
        next(err);
      });
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
      .catch(function(err){
        next(err);
      });
  },

  getUserByName: function(req, res, next) {
    User.findOne({username: req.params.username})
      .then( function (user) {
        if (!user) return res.sendStatus(401); 
        res.status(200).json(user);
      })
      .catch(function(err){
        next(err);
      });
  },

  getUsers: function(req, res, next) {
    var dbArgs = handleQuery(req.query);

    User.find(dbArgs.filters, dbArgs.fields, dbArgs.params)
      .then(function (users) {
        if (!users) return res.sendStatus(401);
        res.status(200).json(users);
      })
      .catch(function(err){
        next(err);
      });
  },

  deleteUserByName: function(req, res, next) {
    User.findOne({username: req.params.username})
      .then( function (user) {
        if (!user) return res.sendStatus(401);
        user.remove();
        console.log('deleting user with', req.params);
        res.status(201).json(user);
      })
      .catch(function(err){
        next(err);
      });
  }
};

