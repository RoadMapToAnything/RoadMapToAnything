var handleError = require('../util.js').handleError,
    scrape      = require('./scraper.js');
    

module.exports = {

  scrape : function(req, res, next) {
    var url = req.query.url;

    scrape(url)
    .then(function (scrapes) {
      res.status(200).json({data: scrapes});
    });
  }

};

