var userController = require('./users/userController.js');

module.exports = function (apiRouter) {

  /*
   *      All routes begin with /api/
   */

  apiRouter.get( '/login',  userController.login);
  apiRouter.post('/signup', userController.createUser);
  apiRouter.get('/users/:username', userController.getOne);
  apiRouter.get('/users', userController.getMany);
  apiRouter.delete('/users/:username', userController.deleteOne);

};
