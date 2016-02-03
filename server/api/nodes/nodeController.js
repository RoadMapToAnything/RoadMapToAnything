var Node              = require('./nodeModel.js'),
    roadmapController = require('../roadmaps/roadmapController.js'),
    handleError       = require('../../util.js').handleError,
    handleQuery       = require('../queryHandler.js'),
    getAuthHeader     = require('basic-auth');

module.exports = {

  createNode : function (req, res, next) {
    var username = getAuthHeader(req).name;
    var newNode = req.body;

    // Support /nodes and /roadmaps/roadmapID/nodes
    newNode.parentRoadmap = newNode.parentRoadmap || req.params.roadmapID;

    roadmapController.returnAuthor(newNode.parentRoadmap)
    .then(function (authorName) {
      if (!authorName) {
        res.sendStatus(400);
        return null;
      } else if (authorName !== username) {
        res.sendStatus(403);
        return null;
      } else {
        return Node(newNode).save();
      }
    })
    .then(function(newNode){
      if (newNode) res.status(201).json({data: newNode});
    })
    .catch(handleError.bind(null, next));
  },

  getNodeByID : function (req, res, next) {
    var _id = req.params.nodeID;
    Node.findById(_id)
      .populate('parentRoadmap')
      .then(function(dbResults){
        res.json({data: dbResults});
      })
      .catch(handleError.bind(null, next));
  },

  updateNode : function (req, res, next) {
    var username = getAuthHeader(req).name;
    var _id = req.params.nodeID;

    var updateableFields = [
      'title','description','resourceType','resourceURL','imageUrl'
    ];
    var updateCommand = {};
    updateableFields.forEach(function(field){
      if (req.body[field] !== undefined) updateCommand[field] = req.body[field];
    });

    Node.findOne({_id:_id})
      .deepPopulate('parentRoadmap.author')
      .then(function(node){
        if (!node) {
          res.sendStatus(404);
          return null;
        } else if (node.parentRoadmap.author.username !== username) {
          res.sendStatus(403);
          return null;
        } else {
          return Node.findByIdAndUpdate(_id, updateCommand, {new: true})
                     .populate('parentRoadmap');
        }
      })
      .then(function(updatedNode){
        if (updatedNode) res.json({data: updatedNode});
      })
      .catch(handleError.bind(null, next));
  },

  deleteNode : function (req, res, next) {
    var username = getAuthHeader(req).name;
    var _id = req.params.nodeID;

    Node.findOne({_id:_id})
      .deepPopulate('parentRoadmap.author')
      .then(function(node){
        if (!node) res.sendStatus(404);
        else if (node.parentRoadmap.author.username !== username) {
          res.sendStatus(403);
        } else {
          node.remove();
          res.json({data: node});
        }
      })
      .catch(handleError.bind(null, next));
  }

};