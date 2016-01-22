var userController = require('./users/userController.js');
module.exports = function (apiRouter) {
  //define our routes
  //EVERYTHING in this file is going to be /api/<whatever follows>

  
  apiRouter.get('/login', userController.login);
  apiRouter.post('/signup', userController.createUser);
  apiRouter.get('/users/:username', userController.getOne);
  apiRouter.get('/users', userController.getMany);
  apiRouter.delete('/users/:username', userController.deleteOne);

}
