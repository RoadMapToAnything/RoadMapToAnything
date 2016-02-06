var request = require('request-promise'),
    cheerio = require('cheerio'),
    targets = require('./scrapeTargets.json');


// Settings which will control how some functins operate
var MAX_LENGTH = 256,
    DEFAULT_TAG = 'meta',
    DEFAULT_ATTR = 'content';

var PUNC = {
  '.': true,
  '!': true,
  '?': true,
  ',': true,
  ';': true,
  ':': true
};


// Post-processing helper functions
var clean = function(string) {
  if (!string) return string;

  var cleanWhitespace = function(char) {
    if (char.charCodeAt(0) < 32) return ' ';
    return char;
  };

  var addSpace = function(char, nextChar) {
    if (nextChar === undefined) return char;
    if (PUNC[char] && !PUNC[nextChar] && nextChar !== ' ') return char + ' ';
    return char;
  };

  var removeSpace = function(char, nextChar) {
    if (nextChar === undefined) return char;
    if (char === ' ' && nextChar === ' ') return '';
    return char;
  };

  var truncate = function(string) {
    if (string.length <= MAX_LENGTH) return string;
    return string.substring(0, MAX_LENGTH - 3) + '...';
  };

  var cleaned = '';


  for (var i = 0; i < string.length && i < 300; i++) {
    var char = string[i];
    char = cleanWhitespace(char);
    char = addSpace(char, string[i+1]);
    char = removeSpace(char, string[i+1]);
    cleaned += char;
  }

  return truncate(cleaned);
};

var nameFromUrl = function(url) {
  if (!url) return url;

  var wwwIndex = url.indexOf('www.');
  var name;

  if (url.indexOf('/') === -1 && wwwIndex === -1) return url;

  var wwwIndex = url.indexOf('www.');
  var name;

  if (wwwIndex !== -1) name = url.substring(wwwIndex + 4);
  else name = url.substring(url.indexOf('//') + 2);

  name = name.substring(0, name.indexOf('/'));

  return name;
};

var appendHref = function(full, partial) {
  if (!partial || partial.substring(0, 4) === 'http') return partial;

  var append;

  // Just appends http: or https:
  if (partial.substring(0, 2) === '//') {
    append = full.substring( 0, full.indexOf('//') );
    return append + partial;
  }

  // Appends everything up to the end of the domain
  append = full.substring( 0, full.indexOf('/', 7) );
  return append + partial;
};


// Scrapes a property based on an array of possible target tags
var scrapeProperty = function($, targets) {
  var tag, prop, val, attr, scrape;

  for (var i = 0; i < targets.length; i++) {
    var target = targets[i];

    tag = target.tag || DEFAULT_TAG;
    prop = target.prop ? '[' + target.prop + '=' : '';
    val = target.val ?  '"' + target.val + '"]' : '';
    attr = target.attr || DEFAULT_ATTR;

    if (target.text) scrape = clean( $(tag + prop + val).text() );
    else scrape = $(tag + prop + val).attr(attr);

    if (scrape) return scrape;
  }
};


module.exports = function (url) {
  return request(url)
  .then(function (html) {
    var $ = cheerio.load(html);
    var scrapes = {};

    // Attempt to scrape every property in scrapeTargets.json
    for (var key in targets) {
      scrapes[key] = scrapeProperty($, targets[key]);
    }

    // Perform some post-processing on particular properties
    scrapes.siteName = nameFromUrl(scrapes.siteName);
    scrapes.imageUrl = appendHref(url, scrapes.imageUrl);
    scrapes.siteIcon = appendHref(url, scrapes.siteIcon);
    
    return scrapes;
  });
};