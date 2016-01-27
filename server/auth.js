var getAuthHeader = require('basic-auth'),
    bcrypt = require('bcrypt-nodejs'),
    User = require('./api/users/userModel.js');



var name = 'bren';
var pass = 'pass';
bcrypt.hash(name+pass, null, null, function(err, hash){
  console.log(hash);
  bcrypt.compare('brenpass', hash, function(err, isValid){
    console.log(isValid);
  })
});

function findInDB(user, response, next) {
  var result = false;
  User.findOne({
      username: user['name'],
      password: user['pass']
    },
    function(error, data) {
      if (error) {
        console.log(error);
        response.statusCode = 401;
        response.end('Unauthorized');
      } else {
        if (!data) {
          console.log('Unknown user');
          response.statusCode = 401;
          response.end('Unauthorized');
        } else {
          console.log(data.username + ' authenticated successfully ');
          next();
        }
      }
    });
  }

module.exports = {
  authenticate : function(request, response, next) {
    var user = getAuthHeader(request);
    console.log('Authenticating: ', user);
    if (user === undefined) {
      console.log('User information is not available in the request ');
      response.statusCode = 401;
      response.setHeader('WWW-Authenticate', 'Basic');
      response.end('Unauthorized');
    } else {
      findInDB(user, response, next);
    }
  }
};