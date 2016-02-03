angular.module('services.request', [])

.factory('Request', ['$http', function($http){
  var Request = {};

  // Handles all request formatting, as they are only slightly 
  // different from type to type
  var makeRequest = function(type, url, data, options) {
    var request = {
      method: type,
      url: url
    };

    // Attach optional request parameters
    if (options.auth) request.headers = {Authorization: encodeAuthHeader()};
    if (type === 'GET' && data) request.params = data;
    else if (data) request.data = data;
    
    // Overwrite standard functions if they are turned off
    if (!options.format) var standardFormat = function(){};
    if (!options.log) var standardLog = function(){};
    

    return $http(request)
    .then(standardLog)
    .then(standardFormat)
    .catch(standardError);
  };

  var encodeAuthHeader = function() {
    var user = localStorage.getItem('user.username');
    var token = localStorage.getItem('user.authToken');
    return 'Basic ' + btoa(user + ':' + token);
  };

  var standardLog = function(res) {
    console.log( '(' + res.status + ') ' + 
      res.config.method + ' successful for ' + 
      parseName(res) + ': ', res.data.data );

    return res;
  };

  var standardFormat = function(res) {
    return res.data.data;
  };

  var standardError = function(err) {
    console.log( '(' + err.status + ') ' +
      err.config.method + ' failed for ' +
      parseName(err) + ': ', err.data );
  };

  // Parses a name to be logged by responses and errors
  var parseName = function(res) {
    var nameKeys = ['title', 'username'];
    var name;

    // Grab the name of the item affected from response
    if (res.data.data) {
      nameKeys.forEach(function (key) {
        if (res.data.data[key]) name = res.data.data[key];
      });
    }

    // If name cannot be pulled from response, pull from url
    if (!name) name = res.config.url.split('/')[2];

    return name;
  };

  // Sets any options passed, and then returns the defaults
  var mergeDefaults = function(options, defaults) {
    for (var key in options) {
      defaults[key] = options[key];
    }

    return defaults;
  };


  /* * * * * * * * * * * * * * * * * * * * * 
   *           FACTORY METHODS             *
   * * * * * * * * * * * * * * * * * * * * */

  // Sends a GET request with an optional query object, and options
  Request.get = function(url, query, options) {
    options = mergeDefaults(options, {auth: false, log: true, format: true});
    return makeRequest('GET', url, query, options);
  };

  // Sends a POST request with an optional query object, and options
  Request.post = function(url, data, options) {
    options = mergeDefaults(options, {auth: true, log: true, format: true});
    return makeRequest('POST', url, data, options);
  };

  // Sends a PUT request with an optional query object, and options
  Request.put = function(url, data, options) {
    options = mergeDefaults(options, {auth: true, log: true, format: true});
    return makeRequest('PUT', url, data, options);
  };

  // Sends a DELETE request with an optional query object, and options
  Request.delete = function(url, options) {
    options = mergeDefaults(options, {auth: true, log: true, format: true});
    return makeRequest('DELETE', url, null, options);
  };

  return Request;

}]);