var Roadmap = require('./roadmapModel.js'),
    handleError = require('../../util.js').handleError,
    handleQuery = require('../queryHandler.js');

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
    var dbArgs = handleQuery(req.query);

    Roadmap.find(dbArgs.filters, dbArgs.fields, dbArgs.params)
      .populate('author nodes')
      .then(function(dbResults){
        res.json(dbResults);
      })
      .catch(handleError(next));
  },

  getRoadmapByID : function (req, res, next) {
    var _id = req.params.roadmapID;
    Roadmap.findById(_id)
      .populate('author nodes')
      .then(function(dbResults){
        res.json(dbResults);
      })
      .catch(handleError(next));
  },

  updateRoadmap : function (req, res, next) {
    var _id = req.params.roadmapID;
    var updateCommand = req.body;
    Roadmap.findByIdAndUpdate(_id, updateCommand)
      .populate('author nodes')
      .then(function(dbResults){
        res.json(dbResults);
      })
      .catch(handleError(next));
  },

  deleteRoadmap : function (req, res, next) {
    var _id = req.params.roadmapID;
    Roadmap.findOne({_id:_id})
      .populate('author nodes')
      .then(function(roadmap){
        if (roadmap) roadmap.remove();
        res.json(roadmap);
      })
      .catch(handleError(next));
  }

};