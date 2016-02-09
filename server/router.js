module.exports = function (app, express) {

  var apiRouter = express.Router();
  var scrapeRouter = express.Router();
  var authRouter = express.Router();

  app.use('/api', apiRouter);
  app.use('/scrape', scrapeRouter);
  app.use('/auth', authRouter);

  require('./api/apiRouter.js')(apiRouter); 
  require('./scrape/scrapeRouter.js')(scrapeRouter); 
  require('./auth/authRouter.js')(authRouter); 

};
