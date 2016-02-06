module.exports = function (app, express) {
  //break up routes to more modular pieces here
  var apiRouter = express.Router(); //returns mini express application
  var scrapeRouter = express.Router();

  app.use('/api', apiRouter);
  app.use('/scrape', scrapeRouter);

  require('./api/apiRouter.js')(apiRouter); 
  require('./scrape/scrapeRouter.js')(scrapeRouter); 

};
