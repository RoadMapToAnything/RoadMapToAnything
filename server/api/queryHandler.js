// Parameters which may not be used in queries.
var forbidden = {
  'password': true,
  '-password': true
};

// DB Parameters which may be returned, and must be accessed by helpers.
var filters;
var fields;
var params;

// Object for handling different possible db parameters.
var paramHandler = {
  
  sort: function (value) {
    if (forbidden[value]) return;
    params.sort = value;
  }

};

// Object for handling different possible db filters.
var filterHandler = function (key, value) {
  if (forbidden[key]) return;
  var convert = {
    '>': '$gt',
    '<': '$lt'
  };
  var first = value.slice(0, 1);
  var end = value.slice(1);

  if (convert[first]) {
    value = {};
    value[convert[first]] = end;
  }

  filters[key] = value;
};

// Builds an array of arguments to pass into the Mongoose find() method.
module.exports = function (query) {
  filters = {};
  fields = null;
  params = {};

  for (var key in query) {
    // Handle designated parameters first.
    if (paramHandler[key]) paramHandler[key](query[key]);

    // Anything else is a filtering parameter.
    else filterHandler(key, query[key]);
  }

  // TODO: Handle fields.

  return {
    filters: filters, 
    fields: fields, 
    params: params
  };
};