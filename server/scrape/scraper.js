var request = require('request-promise'),
    cheerio = require('cheerio');

var images = [
  {tag: 'link', prop: 'itemprop', val: 'thumbnailUrl', attr: 'href'},
  {prop: 'property', val: 'og:image'},
  {prop: 'itemprop', val: 'image'}
];

var titles = [
  {prop: 'name', val: 'title'},
  {prop: 'property', val: 'og:title'},
  {prop: 'name', val: 'twitter:title'},
  {tag: 'h1', text: true},
  {tag: 'title', text: true}
];

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
      title: scrapeProperty($, titles),
      imageUrl: scrapeProperty($, images)
    };
  });
};