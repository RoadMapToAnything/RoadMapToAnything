module.exports = {
  /*
   *    Abstraction of 
   *        .catch(function(err){
   *          next(err)
   *        });
   *
   *    Example use:
   *         var handleError = require('../../util.js').handleError;
   *                           ...
   *         Async()
   *           .then(...)
   *           .catch(handleError(next));
   *
   */
  handleError : function (next){
    return function (err){
      next(err);
    };
  }

};