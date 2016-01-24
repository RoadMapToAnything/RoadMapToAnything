var Node        = require('./nodeModel.js'),
    handleError = require('../../util.js').handleError,
    handleQuery = require('../queryHandler.js');

module.exports = {

  createNode : function (req, res, next) {
    var newNode = req.body;
    // Support /nodes and /roadmaps/roadmapID/nodes
    newNode.parentRoadmap = newNode.parentRoadmap || req.params.roadmapID;
    Node(newNode).save()
      .then(function(dbResults){
        res.status(201).json(dbResults);
      })
      .catch(handleError(next));
  },

  getNodeByID : function (req, res, next) {
    var _id = req.params.nodeID;
    Node.findById(_id)
      .then(function(dbResults){
        res.json(dbResults);
      })
      .catch(handleError(next));
  },

  updateNode : function (req, res, next) {
    var _id = req.params.nodeID;
    var updateCommand = req.body;
    Node.findByIdAndUpdate(_id, updateCommand)
      .then(function(dbResults){
        res.json(dbResults);
      })
      .catch(handleError(next));
  },

  deleteNode : function (req, res, next) {
    var _id = req.params.nodeID;
    Node.findByIdAndRemove(_id)
      .then(function(dbResults){
        res.json(dbResults);
      })
      .catch(handleError(next));
  }

};