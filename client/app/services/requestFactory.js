angular.module('services.request', [])

.factory('Request', ['$http', function($http){

  // System wide default options for requests
  var systemDefaults = {auth: true, log: true, format: true};

  /* * * * * * * * * * * * * * * * * * * * * 
   *            HELPER METHODS             *
   * * * * * * * * * * * * * * * * * * * * */

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

  // Starts with system defaults, applies custom defaults, and then instance options
  var mergeDefaults = function(options, customDefaults) {
    for (var key in customDefaults) {
      systemDefaults[key] = customDefaults[key]
    }

    for (var key in options) {
      systemDefaults[key] = options[key];
    }

    return systemDefaults;
  };

  // Determines whether a given object is an options object
  var isOptions = function(obj) {
    for (var key in systemDefaults) {
      if (obj[key]) return true;
    }

    return false;
  };

  // Ensures factory methods optional parameters are set correctly
  var parseOptionals = function(data, options) {
    if (data && !options && isOptions(data)) {
      options = data;
      data = undefined;
    }
  };


  /* * * * * * * * * * * * * * * * * * * * * 
   *           FACTORY METHODS             *
   * * * * * * * * * * * * * * * * * * * * */

  // Similar to $http, Request handles all http requests, with the
  // additional option to handle logging, formatting, and errors

  // Looks for the following parameters:
  //  - method: http method
  //  - url: url
  //  - data: either data or query object, depending on method
  //  - options: {
  //    - auth: if true, sets standard auth headers
  //    - log: if true, console logs the response 
  //    - format: if true, sends back response.data.data
  //  }

  // Generally speaking, this method should not be called directly,
  // instead use the get, post, put, and delete convenience methods
  var Request = function(params) {
    var format = standardFormat;
    var log = standardLog;
    var request = {
      method: params.method,
      url: params.url
    };

    // Attach optional request parameters
    if (params.options.auth) request.headers = {Authorization: encodeAuthHeader()};
    if (params.method === 'GET' && params.data) request.params = params.data;
    else if (params.data) request.data = params.data;
    
    // Overwrite standard functions if they are turned off
    if (!params.options.format) format = function(res){ return res; };
    if (!params.options.log) log = function(res){ return res; };
    

    return $http(request)
    .then(log)
    .then(format)
    .catch(standardError);
  };


  // Sends a GET request with an optional query options objects
  Request.get = function(url, query, options) {
    parseOptionals(query, options);

    return Request({
      method: 'GET', 
      url: url, 
      data: query, 
      options: mergeDefaults(options, {auth: false})
    });
  };

  // Sends a POST request with an optional query and options objects
  Request.post = function(url, data, options) {
    parseOptionals(data, options);

    return Request({
      method: 'POST', 
      url: url, 
      data: data, 
      options: mergeDefaults(options)
    });
  };

  // Sends a PUT request with an optional query and options objects
  Request.put = function(url, data, options) {
    parseOptionals(data, options);
    
    return Request({
      method: 'PUT', 
      url: url, 
      data: data, 
      options: mergeDefaults(options)
    });
  };

  // Sends a DELETE request with any options specified
  Request.delete = function(url, options) {
    return Request({
      method: 'DELETE', 
      url: url,
      options: mergeDefaults(options)
    });
  };


  return Request;

}]);