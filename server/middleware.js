var morgan = require('morgan'),
    bodyParser = require('body-parser'),
    cors = require('cors');


//basic middleware for all routes
module.exports = function (app, express){
  app.use(express.static(__dirname + "/../client")); //where your static content is located in your filesystem);
  app.use(morgan('dev')); //pass in dev to set it to development mode
  app.use(cors()); //pass in dev to set it to development mode
  app.use(bodyParser.urlencoded( {extended: true} )); //can support other data types by default
  app.use(bodyParser.json()); //parses JSON
}

