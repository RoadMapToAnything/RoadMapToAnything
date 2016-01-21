angular.module('app', [
  'ui.router',
  'app.main',
  'app.auth'
  
  ])
// Placeholder header and footer
.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
  $urlRouterProvider.otherwise('/');
  $stateProvider
    .state('main', {
      abstract : true,
      templateUrl: 'app/main/main.html',
      controller: 'MainController'
    })
    .state('main.main', {
      url: "/main",
      views: {
        'header@': {
          templateUrl: 'app/main/main.header.html'
        },
        'footer@': {
          templateUrl: 'app/main/main.footer.html'
        }
      } 
    })


      // .state('main.footer', {
      //   url: '/footer',
      //   templateUrl: "app/main/main.footer.html",
      //   controller: "MainController"
      // })
      // .state('main.header', {
      //   url: '/header',
      //   templateUrl: "app/main/main.footer.html",
      //   controller: "MainController"
      // })

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