var request = require('request-promise'),
    cheerio = require('cheerio'),
    targets = require('./scrapeTargets.json');

var scrapeProperty = function($, targets) {
  var tag, prop, val, attr, scrape;

  for (var i = 0; i < targets.length; i++) {
    var target = targets[i];

    tag = target.tag || 'meta';
    prop = target.prop ? '[' + target.prop + '=' : '';
    val = target.val ?  '"' + target.val + '"]' : '';
    attr = target.attr || 'content';

    if (target.text) scrape = $(tag + prop + val).text();
    else scrape = $(tag + prop + val).attr(attr);

    if (scrape) return scrape;
  }
};

module.exports = function (url) {
  return request(url)
  .then(function (html) {
    var $ = cheerio.load(html);
    
    return {
      title: scrapeProperty($, targets.title),
      imageUrl: scrapeProperty($, targets.imageUrl),
      description: scrapeProperty($, targets.description)
    };
  });
};