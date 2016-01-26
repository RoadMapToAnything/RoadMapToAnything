var express  = require('express'),
    mongoose = require('mongoose'),
    CONF = require('../_config.json');

mongoose.Promise = require('bluebird');


var app      = express();
var port     = process.env.PORT || CONF.PORT.LOCAL;
if (process.env.NODE_ENV === 'test') port = CONF.PORT.TEST;

var database = process.env.MONGOLAB_URI || CONF.DB_URI;
mongoose.connect(database);

require('./middleware.js')(app, express);
require('./router.js'    )(app, express);

app.listen(port, function(){ 
  console.log('APP IS RUNNING ON', port);
});
  

module.exports = {
  app: app  // used in server spec
};