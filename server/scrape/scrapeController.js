var handleError = require('../util.js').handleError,
    scrape      = require('./scraper.js');
    

module.exports = {

  scrapeForNode : function(req, res, next){
    var url = req.query.url;

    res.status(200).json({data: scrape(url)});
  }

};

