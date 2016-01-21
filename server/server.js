var express = require('express'),
    mongoose = require('mongoose');

   mongoose.Promise = require('bluebird');
   
var app = express();
var port = process.env.PORT || 3000;
var database = process.env.MONGOLAB_URI || 'mongodb://localhost/testdb';
mongoose.connect(database);



require('./middleware.js')(app, express);
require('./router.js')(app, express);

app.listen(port, function(){ 
  console.log("APP IS RUNNING ON", port)
}); //the port you want to use


