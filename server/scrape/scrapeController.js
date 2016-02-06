var handleError = require('../util.js').handleError;
    

module.exports = {

  test : function(req, res, next){
    res.status(200).json({data: 'Hello World'});
  }

};

