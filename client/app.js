angular.module('app', [
  'ui.router',
  'app.main',
  'app.auth'
  ])

.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
  $urlRouterProvider.otherwise('/');
  $stateProvider
    .state('main', {
      url: '/main',
      templateUrl: 'main/main.html',
      controller: "MainController"
    })
    .state('signup', {
      url: "/signup",
      templateUrl: "app/auth/signup.html",
      controller: "AuthController"
    })
    .state('signin', {
      url: "/signin",
      templateUrl: "app/auth/signin.html",
      controller: "AuthController"
    });

});



