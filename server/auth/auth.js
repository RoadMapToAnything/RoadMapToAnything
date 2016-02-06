var getAuthHeader = require('basic-auth'),
    bcrypt        = require('bcrypt-nodejs'),
    request       = require('request-promise'),
    handleError   = require('../util.js').handleError,
    User          = require('../api/users/userModel.js'),
    CONF          = require('../../_private-config.json');


var findInDB = function (user, res, next) {
  User.findOne({ username: user.name })
    .then(function(dbResults){
        if (!dbResults) {
          res.status(401).end('Unauthorized'); // No such username exists
        } else {
          bcrypt.compare(dbResults.password, user.pass, function(err, isValid){
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
    user.pass = new Buffer(user.pass, 'base64').toString('ascii'); // decode token
    if (user === undefined) {
      res.setHeader('WWW-Authenticate', 'Basic');
      res.status(401).end('Unauthorized');

    // Auth provider: Facebook
    } else if (user.pass.slice(0,6) === 'AUTHFB') {
      module.exports.debugFacebookToken(user.pass.slice(6))
        .then(function(response){
          var tokenData = JSON.parse(response).data;
          if (tokenData.is_valid) next();
        })
        .catch(function(err){console.log(err)})

    // Auth provider: Local
    } else {
      findInDB(user, res, next);
    }
  },
  debugFacebookToken: function (accessToken) {
    var debugTokenURL = 'https://graph.facebook.com/debug_token' 
      + '?input_token=' + accessToken
      + '&access_token=' + CONF.FACEBOOK_APP_ID +'|'+ CONF.FACEBOOK_APP_SECRET;

    return request(debugTokenURL);
  }
};