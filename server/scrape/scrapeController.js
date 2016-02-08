var handleError = require('../util.js').handleError,
    scrape      = require('./scraper.js');

var blacklist = {
  pdf: true
};

module.exports = {

  scrape : function(req, res, next) {
    var url = req.query.url;

    // Prevent blacklisted extensions from hitting the scraper
    var extension = url.split('.').pop();
    if (blacklist[extension]) return res.sendStatus(400);

    scrape(url)
    .then(function (scrapes) {
      res.status(200).json({data: scrapes});
    });
  }

};

