// Parameters which may not be used in queries.
var forbidden = {
  'password': true,
  '-password': true
};

// Object for handling different possible db parameters.
var paramHandler = {

  sort: function (value) {
    if (forbidden[value]) return false;
    return ['sort', value];
  }

};

// Builds an array of arguments to pass into the Mongoose find() method.
module.exports = function (query) {
  var filters = {};
  var fields = null;
  var params = {};

  for (var key in query) {
    // Handle designated parameters first.
    if (paramHandler[key]) {
      var param = paramHandler[key](query[key]);
      if (param) params[param[0]] = param[1];

    // Anything else is a filter parameter and passes straight through.
    } else {
      if (!forbidden[key]) filters[key] = query[key];
    }
  }

  // TODO: Handle fields.


  return {
    filters: filters, 
    fields: fields, 
    params: params
  };
};