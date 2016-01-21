module.exports = function (app, express) {
  //break up routes to more modular pieces here
  var apiRouter = express.Router(); //returns mini express application
  app.use('/api', apiRouter);

  require('./api/apiRouter.js')(apiRouter); 

}
