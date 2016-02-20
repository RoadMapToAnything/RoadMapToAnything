var cheerio = require('cheerio'),
    targets = require('./scrapeTargets.json');


module.exports = function (html, url) {
  var $ = cheerio.load(html);
  var scrapes = {};

  // Attempt to scrape every property in scrapeTargets.json
  for (var key in targets) {
    scrapes[key] = scrapeProperty($, targets[key]);
  }

  // Perform some post-processing on particular properties
  scrapes.siteName = nameFromUrl( completeUrl(url, scrapes.siteName || url) );
  scrapes.imageUrl = completeUrl(url, scrapes.imageUrl);
  scrapes.siteIcon = completeUrl(url, scrapes.siteIcon);
  
  return scrapes;
};


/*
 * Settings to modify some function behavior
 */
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


/*
 * Scrape a property based on an imported array of possible targets
 */
var scrapeProperty = function($, targets) {
  var tag, prop, val, attr, scrape, selection;

  for (var i = 0; i < targets.length; i++) {
    var target = targets[i];

    // Build a new jQuery selector for a scrape attempt
    tag = target.tag || DEFAULT_TAG;
    prop = target.prop ? '[' + target.prop + '=' : '';
    val = target.val ?  '"' + target.val + '"]' : '';
    attr = target.attr || DEFAULT_ATTR;

    // If grabbbing text instead of an attribute, clean it up
    if (target.text) {
      selection = $(tag + prop + val);
      selection.find('script').remove();
      scrape = clean( selection.text() );
    } else {
      scrape = $(tag + prop + val).attr(attr);
    }

    // End the loop and return as soon as a scrap is successful
    if (scrape) return scrape;
  }
};


/*
 * Reformat text to be clean and consistent
 */
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
    return string.slice(0, MAX_LENGTH - 3) + '...';
  };

  var cleaned = '';
  string = string.trim();

  // Traverse the string, cleaning internal white space
  for (var i = 0; i < string.length && i < 300; i++) {
    var char = string[i];
    char = cleanWhitespace(char);
    char = addSpace(char, string[i+1]);
    char = removeSpace(char, string[i+1]);
    cleaned += char;
  }

  return truncate(cleaned);
};


/*
 * Convert a url into a site name, e.g. 'Udemy.com'
 */
var nameFromUrl = function(url) {
  var name, nameSplit;

  if (!url) return url;
  if (url.indexOf('/') === -1 && url.indexOf('.') === -1) return url;

  name = url;

  // Grab everything to the right of the '//'
  if (name.indexOf('//') !== -1) name = name.slice(url.indexOf('//') + 2);

  // Grab everything to the left of the first '/'
  if (name.indexOf('/') !== -1) name = name.slice(0, name.indexOf('/'));

  // Remove the subdomain
  nameSplit = name.split('.');
  if (nameSplit.length > 2) {
    nameSplit.shift();
    name = '' + nameSplit.join('.');
  }

  // Capitalize the first letter
  name = name[0].toUpperCase() + name.slice(1);

  return name;
};


/*
 * Ensure a URL has a full static path, e.g. 'http://www...'
 */
var completeUrl = function(full, partial) {
  if (!partial) return partial;
  if (partial.slice(0, 4) === 'http') return partial;
  if (partial.indexOf('/') === -1 && partial.indexOf('.') === -1) return partial;

  // Prepend http: or https: and return
  if (partial.slice(0, 2) === '//') 
    return full.slice( 0, full.indexOf('//') ) + partial;

  // Prepend the domain and return
  if (partial[0] === '/') 
    return full.slice( 0, full.indexOf('/', 9) ) + partial;


  // Handle ../ notation and same level urls
  var upDir = 1;

  partial = partial.split('/').reduce(function (url, elem) {
    if (elem === '..') {
      upDir++;
      return url;
    }
    return url + '/' + elem;
  }, '');

  partial = full.split('/').reverse().reduce(function (url, elem) {
    if (upDir > 0){
      upDir--;
      return url;
    }
    return elem + '/' + url;
  }, partial.slice(1));

  return partial;
};
