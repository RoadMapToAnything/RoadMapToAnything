
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
      url: '/main',
      templateUrl: 'main/main.html',
      views: {
        "footer": {
          template: "main.footer"
        },
        "header": {
          template: "main.header"
        }
      }
      controller: "MainController"
    })
      // .state('main.footer', {
      //   url: '/footer',
      //   templateUrl: "main/main.footer.html",
      //   controller: "MainController"
      // })
      // .state('main.header', {
      //   url: '/header',
      //   templateUrl: "main/main.footer.html",
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