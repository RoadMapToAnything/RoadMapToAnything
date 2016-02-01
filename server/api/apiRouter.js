var userController    = require('./users/userController.js'),
    roadmapController = require('./roadmaps/roadmapController.js'),
    nodeController    = require('./nodes/nodeController.js'),
    auth              = require('../auth.js').authenticate;

module.exports = function (apiRouter) {

  /*
   *      All routes begin with /api/
   */

  apiRouter.get( '/login',  userController.login);
  apiRouter.post('/signup', userController.createUser);


  /*
   *      User Routes
   */
  apiRouter.get(   '/users',           userController.getUsers);
  apiRouter.get(   '/users/:username', userController.getUserByName);
  apiRouter.put(   '/users/:username', userController.updateUserByName);
  apiRouter.delete('/users/:username', userController.deleteUserByName);


  /*
   *      Roadmap Routes
   */
   apiRouter.post(  '/roadmaps',            auth, roadmapController.createRoadmap  );
   apiRouter.get(   '/roadmaps',                  roadmapController.getRoadmaps    );
   apiRouter.get(   '/roadmaps/:roadmapID',       roadmapController.getRoadmapByID );
   apiRouter.put(   '/roadmaps/:roadmapID',       roadmapController.updateRoadmap  );
   apiRouter.delete('/roadmaps/:roadmapID', auth, roadmapController.deleteRoadmap  );

   // Effects User model
   apiRouter.put('/roadmaps/:roadmapID/:action', auth, userController.roadmapAction );


   /*
    *      Node Routes
    */

    // Create a node
    apiRouter.post('/roadmaps/:roadmapID/nodes', nodeController.createNode);
    apiRouter.post(                    '/nodes', nodeController.createNode);

    apiRouter.get(   '/nodes/:nodeID', nodeController.getNodeByID);
    apiRouter.put(   '/nodes/:nodeID', nodeController.updateNode);
    apiRouter.delete('/nodes/:nodeID', nodeController.deleteNode);


};
