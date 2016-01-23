var morgan = require('morgan'),
    bodyParser = require('body-parser'),
    cors = require('cors');

module.exports = function (app, express){

  /*
   *    Middleware common to all routes
   */

  app.use(express.static(__dirname + '/../client')); // serve static content from this directory;
  if (process.env.NODE_ENV !== 'test') app.use(morgan('dev')); // 'dev' is the logging format
  app.use(cors());
  app.use(bodyParser.urlencoded( {extended: true} )); // enable JSON-like support in query string
  app.use(bodyParser.json()); // parse JSON and place in req.body
  
};

