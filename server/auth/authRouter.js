var passport         = require('passport'),
    FacebookStrategy = require('passport-facebook').Strategy,
    request          = require('request-promise'),
    auth             = require('./auth.js'),
    userController   = require('../api/users/userController.js'),
    CONF             = require('../../_private-config.json');


module.exports = function (authRouter) {

  passport.use(new FacebookStrategy({
      clientID: CONF.FACEBOOK_APP_ID,
      clientSecret: CONF.FACEBOOK_APP_SECRET,
      callbackURL: '/auth/facebook/callback'
    }, function(){/*not used*/}));

  authRouter.get('/facebook', passport.authenticate('facebook'));

  authRouter.get('/facebook/callback', function(req, res, next){
      var authorizationCode = req.query.code;

      var getAccessTokenURL = 'https://graph.facebook.com/v2.5/oauth/access_token'
        + '?client_id=' + CONF.FACEBOOK_APP_ID
        + '&redirect_uri=' + 'http://localhost:3000/auth/facebook/callback'
        + '&client_secret=' + CONF.FACEBOOK_APP_SECRET
        + '&code=' + authorizationCode; 

      request(getAccessTokenURL)
        .then(function(response){
          var accessToken = JSON.parse(response).access_token;
          return [accessToken, auth.debugFacebookToken(accessToken)];
        })
        .spread(function(accessToken, response){
          var tokenData = JSON.parse(response).data;
          var facebookUserID = tokenData.user_id;
          var fakeReq = {
            body: {
              username: 'temp-FBUSER-'+facebookUserID,
              password: 'AUTHFB'+accessToken, // TODO: find another approach
              facebookUserId: facebookUserID,
              accessToken: accessToken
            }
          };
          if (tokenData.is_valid) userController.createUser(fakeReq, res, next);
          else res.sendStatus(400); //invalid FB token
        })

    });

};