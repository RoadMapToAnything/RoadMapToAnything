var handleError = require('../util.js').handleError,
    scrape      = require('./scraper.js');
    

module.exports = {

  scrapeForNode : function(req, res, next){
    var url = req.query.url;

    scrape(url)
    .then(function (result) {
      res.status(200).json({data: result});
    });
  }

};

