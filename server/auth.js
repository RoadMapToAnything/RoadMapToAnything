var getAuthHeader = require('basic-auth'),
    bcrypt = require('bcrypt-nodejs'),
    handleError = require('./util.js').handleError,
    User = require('./api/users/userModel.js');

var findInDB = function (user, res, next) {
  User.findOne({ username: user.name })
    .then(function(dbResults){
        if (!dbResults) {
          res.status(401).end('Unauthorized'); // No such username exists
        } else {
          var decodedHash = new Buffer(user.pass, 'base64').toString('ascii');
          bcrypt.compare(dbResults.password, decodedHash, function(err, isValid){
            if (isValid) next(); // Authentication successful
            else res.status(401).end('Unauthorized'); // Invalid credentials
          });
        }
      })
    .catch(function(err){ console.log('Authentication Error', err);});
};

module.exports = {
  authenticate : function(req, res, next) {
    var user = getAuthHeader(req); // Parse information in Authorization header
    if (user === undefined) {
      res.setHeader('WWW-Authenticate', 'Basic');
      res.status(401).end('Unauthorized');
    } else {
      console.log('Looking for', user, 'in DB');
      findInDB(user, res, next);
    }
  }
};