var express  = require('express'),
    mongoose = require('mongoose'),
    CONF = require('../_config.json');

mongoose.Promise = require('bluebird');


var app      = express();
var port     = process.env.PORT || CONF.PORT.MAIN;
var database = process.env.MONGOLAB_URI || CONF.DB_URI.MAIN;

if (process.env.NODE_ENV === 'test') {
  port = CONF.PORT.TEST;
  database = CONF.DB_URI.TEST;
}

// Supress all server-side console logs when testing
require("log-suppress").init(console, 'test');

mongoose.connect(database);

require('./middleware.js')(app, express);
require('./router.js'    )(app, express);

app.listen(port, function(){ 
  console.log('APP IS RUNNING ON', port);
});
  

module.exports = {
  app: app  // used in server spec
};