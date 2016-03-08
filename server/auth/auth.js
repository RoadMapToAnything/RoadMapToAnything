var getAuthHeader  = require('basic-auth'),
    bcrypt         = require('bcrypt-nodejs'),
    request        = require('request-promise'),
    handleError    = require('../util.js').handleError,
    userController = require('../api/users/userController.js');

// Check if we are in deployed state and if not, require the _private-config.json file   
if(process.env.FACEBOOK_APP_ID === undefined && process.env.FACEBOOK_APP_SECRET === undefined){
  var  CONF             = require('../../_private-config.json');
}



var Facebook = {};
Facebook.getTokenData = function (accessToken) {
  // Check if process.env Facebook keys are available
  if(process.env.FACEBOOK_APP_ID === undefined && process.env.FACEBOOK_APP_SECRET === undefined){
    var debugTokenURL = 'https://graph.facebook.com/debug_token' 
      + '?input_token=' + accessToken
      + '&access_token=' + CONF.FACEBOOK_APP_ID +'|'+ CONF.FACEBOOK_APP_SECRET;
  } else {
    var debugTokenURL = 'https://graph.facebook.com/debug_token' 
      + '?input_token=' + accessToken
      + '&access_token=' + process.env.FACEBOOK_APP_ID +'|'+ process.env.FACEBOOK_APP_SECRET;
  }

  return request(debugTokenURL);
};

Facebook.getAccessToken = function (authorizationCode) {
  // Check if process.env Facebook keys are available
  if(process.env.FACEBOOK_APP_ID === undefined && process.env.FACEBOOK_APP_SECRET === undefined){
    var getAccessTokenURL = 'https://graph.facebook.com/v2.5/oauth/access_token'
      + '?client_id=' + CONF.FACEBOOK_APP_ID
      + '&redirect_uri=' + 'http://localhost:3000/auth/facebook/callback'
      + '&client_secret=' + CONF.FACEBOOK_APP_SECRET
      + '&code=' + authorizationCode;
    } else {
      var getAccessTokenURL = 'https://graph.facebook.com/v2.5/oauth/access_token'
      + '?client_id=' + process.env.FACEBOOK_APP_ID
      + '&redirect_uri=' + 'http://roadmaptoanything.herokuapp.com/auth/facebook/callback'
      + '&client_secret=' + process.env.FACEBOOK_APP_SECRET
      + '&code=' + authorizationCode;
    }

  return request(getAccessTokenURL);
};

// Redirects to a page on the client that automatically performs login
// operations, then redirects to dashboard
var redirectToAutomaticLogin = function (res, username, authToken) {
  res.redirect('/#/signin/auto?username='  + username
                            +'&authToken=' + authToken);
};

module.exports = {
  authenticate : function(req, res, next) {
    var user = getAuthHeader(req); // Parse information in Authorization header
    if (user) user.pass = new Buffer(user.pass, 'base64').toString('ascii'); // decode token
    if (user === undefined) {
      res.setHeader('WWW-Authenticate', 'Basic');
      res.status(401).end('Unauthorized');

    // Auth provider: Facebook
    } else if (user.pass.slice(0,6) === 'AUTHFB') {
       Facebook.getTokenData(user.pass.slice(6))
        .then(function(response){
          var tokenData = JSON.parse(response).data;
          if (tokenData.is_valid) next(); // Authentication successful
          else res.status(422).end('Unauthorized'); // TODO: handle invalid token
        })
        .catch(function(err){console.log(err)})

    // Auth provider: Local
    } else {
      userController.findByUsername(user.name)
        .then(function(dbResults){
            if (!dbResults) {
              res.status(422).end('Unauthorized'); // Invalid, no such user
            } else {
              userController.validateUser(dbResults, user)
                .then(function(isValid){
                  if (isValid) next(); // Authentication successful
                  else res.status(422).end('Unauthorized'); // Invalid password
                })
            }
          })
        .catch(function(err){ console.log('Authentication Error', err);});
    }
  },


  // After authenticating, Facebook sends a callback request to this route
  // with an authorization code. That code must be exchanged for an access
  // token. This route makes that exchange, then uses the access token to
  // get the Facebook user's user_id. If an account with that ID exists
  facebookCallbackHandler : function(req, res, next){
      var authorizationCode = req.query.code;

      Facebook.getAccessToken(authorizationCode)
        .then(function(response){
          var accessToken = JSON.parse(response).access_token;
          return [accessToken, Facebook.getTokenData(accessToken)];
        })
        .spread(function(accessToken, response){
          var tokenData = JSON.parse(response).data;
          var facebookUserId = tokenData.user_id;

          if (!tokenData.is_valid) res.sendStatus(400) // invalid FB token

          else {
            userController.findByFacebookId(facebookUserId)
              .then(function(user){
                // If user exists with that Facebook ID, pass along for login
                if (user) return user;
                // Else, create the user
                else {
                  var newUser =  {
                    username: 'temp-FBUSER-'+facebookUserId,
                    password: 'AUTHFB'+accessToken, // TODO: find another approach
                    facebookUserId: facebookUserId,
                  };
                  return userController.createUserFacebook(newUser);
                }
              })
              .then(function(user){
                return [user, user.password];
              })
              .spread( userController.generateAuthToken )
              .then(function(results){
                redirectToAutomaticLogin(res, results.username, results.authToken);
              })
              .catch(handleError(next));
          }
        })
        .catch(handleError(next));
  }
};
