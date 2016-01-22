var Roadmap = require('./roadmapModel.js');

module.exports = {

  createRoadmap : function (req, res, next) {
    var newRoadmap = req.body;
    Roadmap(newRoadmap).save()
      .then(function(dbResults){
        res.status(201).json(dbResults);
      })
      .catch(function(err){
        next(err);
      });
  },
  getRoadmaps : function (req, res, next) {
    
  },
  getRoadmapByID : function (req, res, next) {
    
  },
  updateRoadmap : function (req, res, next) {
    
  },
  deleteRoadmap : function (req, res, next) {
    
  }

};