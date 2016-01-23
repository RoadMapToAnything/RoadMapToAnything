var Roadmap = require('./roadmapModel.js'),
    handleError = require('../../util.js').handleError;

module.exports = {

  createRoadmap : function (req, res, next) {
    var newRoadmap = req.body;
    Roadmap(newRoadmap).save()
      .then(function(dbResults){
        res.status(201).json(dbResults);
      })
      .catch(handleError(next));
  },
  getRoadmaps : function (req, res, next) {
    Roadmap.find({})
      .then(function(dbResults){
        res.status(200).json(dbResults);
      })
      .catch(handleError(next));
  },
  getRoadmapByID : function (req, res, next) {
    var _id = req.params.roadmapID;
    Roadmap.findById(_id)
      .then(function(dbResults){
        res.json(dbResults);
      })
      .catch(handleError(next));
  },
  updateRoadmap : function (req, res, next) {
    var _id = req.params.roadmapID;
    var updateCommand = req.body;
    Roadmap.findByIdAndUpdate(_id, updateCommand)
      .then(function(dbResults){
        res.json(dbResults);
      })
      .catch(handleError(next));
  },
  deleteRoadmap : function (req, res, next) {
    var _id = req.params.roadmapID;
    Roadmap.findByIdAndRemove(_id)
      .then(function(dbResults){
        res.json(dbResults);
      })
      .catch(handleError(next));
  }
};