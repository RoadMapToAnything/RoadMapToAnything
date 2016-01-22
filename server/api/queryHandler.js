var paramHandler = {
  sort: function (value) {
    return ['sort', value];
  }
};

module.exports = function (query) {
  var filters = {};
  var columns = null;
  var params = {};

  for (var key in query) {
    // Handle designated parameters first.
    if (paramHandler[key]) {
      var param = paramHandler[key](query[key]);
      params[param[0]] = param[1];

    // Anything else is a filter parameter.
    } else {
      filters[key] = query[key];
    }
  }

  // TODO: Handle columns.


  return [filters, columns, params];
};