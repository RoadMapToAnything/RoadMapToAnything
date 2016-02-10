var cheerio = require('cheerio'),
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
  string = string.trim();

  // Traverse the string, cleaning each character
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
  var name, nameSplit;

  // If there is no slash and no www, then it is already a name
  if (url.indexOf('/') === -1 && wwwIndex === -1) return url;

  name = url;

  // If there is a www, grab everything to the right,
  // Otherwise, everything to the right of the //
  if (wwwIndex !== -1) name = url.substring(wwwIndex + 4);
  else name = url.substring(url.indexOf('//') + 2);

  // Get everything to the left of the first slash
  if (name.indexOf('/') !== -1) name = name.substring(0, name.indexOf('/'));

  // Remove the subdomain
  nameSplit = name.split('.');
  if (nameSplit.length > 2) {
    nameSplit.shift();
    name = '' + nameSplit.join('.');
  }

  // Capitalize the first letter
  name = name[0].toUpperCase() + name.substring(1);

  return name;
};

var appendHref = function(full, partial) {
  if (!partial) return partial;
  if (partial.substring(0, 4) === 'http') return partial;
  if (partial.indexOf('/') === -1 && partial.indexOf('.') === -1) return partial;

  var append;

  // Just appends http: or https:
  if (partial.substring(0, 2) === '//') {
    append = full.substring( 0, full.indexOf('//') );
    return append + partial;
  }

  // Add the domain to the beginning
  if (partial[0] === '/') {
    return full.substring( 0, full.indexOf('/', 9) ) + partial;
  }

  // Handle ../ notation or same level images
  if (true || partial.substring(0, 2) === '..') {
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
    }, partial.substring(1));

    return partial;
  }

  // Appends everything up to the end of the domain
  // append = full.substring( 0, full.indexOf('/', 9) );

  return partial;
};


// Scrapes a property based on an array of possible target tags
var scrapeProperty = function($, targets) {
  var tag, prop, val, attr, scrape, selection;

  for (var i = 0; i < targets.length; i++) {
    var target = targets[i];

    // Build a new jQuery selector to attempt
    tag = target.tag || DEFAULT_TAG;
    prop = target.prop ? '[' + target.prop + '=' : '';
    val = target.val ?  '"' + target.val + '"]' : '';
    attr = target.attr || DEFAULT_ATTR;

    // If grabbbing text instead of an attribute, it must be cleaned up
    if (target.text) {
      selection = $(tag + prop + val);
      selection.find('script').remove();
      scrape = clean( selection.text() );
    } else {
      scrape = $(tag + prop + val).attr(attr);
    }

    if (scrape) return scrape;
  }
};


module.exports = function (html, url) {
  var $ = cheerio.load(html);
  var scrapes = {};

  // Attempt to scrape every property in scrapeTargets.json
  for (var key in targets) {
    scrapes[key] = scrapeProperty($, targets[key]);
  }

  // Perform some post-processing on particular properties
  scrapes.siteName = nameFromUrl( appendHref(url, scrapes.siteName || url) );
  scrapes.imageUrl = appendHref(url, scrapes.imageUrl);
  scrapes.siteIcon = appendHref(url, scrapes.siteIcon);
  
  return scrapes;
};
