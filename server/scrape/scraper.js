var request = require('request-promise'),
    cheerio = require('cheerio');

module.exports = function (url) {
  return request(url)
  .then(function (html) {
    var $ = cheerio.load(html);
    
    return $('meta[name=description]').attr('content');
  });
};