var userController    = require('./users/userController.js'),
    roadmapController = require('./roadmaps/roadmapController.js'),
    nodeController    = require('./nodes/nodeController.js'),
    auth              = require('../auth.js').authenticate;

module.exports = function (apiRouter) {

  /*
   *      All routes begin with /api
   */

  /* * * * * * * * * * * * * * * * * * * * * 
   *              User Routes              *
   * * * * * * * * * * * * * * * * * * * * */
  apiRouter.get( '/login',  userController.login);
  apiRouter.post('/signup', userController.createUser);

  apiRouter.get(   '/users',                 userController.getUsers);
  apiRouter.get(   '/users/:username',       userController.getUserByName);
  apiRouter.put(   '/users/:username', auth, userController.updateUserByName);
  apiRouter.delete('/users/:username', auth, userController.deleteUserByName);
  
  apiRouter.put('/roadmaps/:roadmapID/:action', auth, roadmapController.actionHandler );
  apiRouter.put('/nodes/:nodeID/complete',      auth, userController.completeNode );


  /* * * * * * * * * * * * * * * * * * * * * 
   *              Roadmap Routes           *
   * * * * * * * * * * * * * * * * * * * * */
   apiRouter.post(  '/roadmaps',            auth, roadmapController.createRoadmap  );
   apiRouter.get(   '/roadmaps',                  roadmapController.getRoadmaps    );
   apiRouter.get(   '/roadmaps/:roadmapID',       roadmapController.getRoadmapByID );
   apiRouter.put(   '/roadmaps/:roadmapID', auth, roadmapController.updateRoadmap  );
   apiRouter.delete('/roadmaps/:roadmapID', auth, roadmapController.deleteRoadmap  );


   /* * * * * * * * * * * * * * * * * * * * * 
    *              Node Routes              *
    * * * * * * * * * * * * * * * * * * * * */
    // Create a node
    apiRouter.post('/roadmaps/:roadmapID/nodes', auth, nodeController.createNode);
    apiRouter.post(                    '/nodes', auth, nodeController.createNode);

    apiRouter.get(   '/nodes/:nodeID',                 nodeController.getNodeByID);
    apiRouter.put(   '/nodes/:nodeID',           auth, nodeController.updateNode);
    apiRouter.delete('/nodes/:nodeID',           auth, nodeController.deleteNode);


};
