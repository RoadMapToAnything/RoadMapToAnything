var scrapeController = require('./scrapeController.js'),
    auth = require('../auth.js').authenticate;

module.exports = function (Router) {

  /*
   *      All routes begin with /scrape
   */

  // Down the road we may implement model specific routes like this
  Router.get( '/node', auth, scrapeController.scrape );

  Router.get( '',      auth, scrapeController.scrape );
  
};
