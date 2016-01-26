angular.module('app', [
  'ui.router',
  'app.main',
  'app.auth',
  'app.dash',
  'app.roadmaps'
  ])
.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
  $urlRouterProvider.otherwise('/');
  $stateProvider
    .state('home', {
      url: '/',
      views: {
        'header': {
          templateUrl: 'app/main/main.header.html',
          controller: 'MainController'
        },
         'welcome': {
          templateUrl: 'app/main/main.welcome.html',
          controller: 'MainController'
        },
         'featured': {
          templateUrl: 'app/main/main.welcome.html',
          controller: 'MainController'
        },
        'content': {
          templateUrl: 'app/main/main.content.html',
          controller: 'MainController',
        },
        'footer': {
          templateUrl: 'app/main/main.footer.html',
          controller: 'MainController'
        },
        'signup': {
          templateUrl: 'app/auth/signup.html',
          controller: 'AuthController'
        }
      }
    })
    .state('signin', {
      views: {
        'content': {
          templateUrl: 'app/auth/signin.html',
          controller: 'AuthController'
        },
        'header': {
          templateUrl: 'app/main/main.header.html',
          controller: 'MainController'
        },
        'footer': {
          templateUrl: 'app/main/main.footer.html',
          controller: 'MainController'
        }
      }
    })
    .state('dashboard', {
      url: '/dashboard',
      views: {
        'content': {
          templateUrl: 'app/progress/dashboard.html',
          controller: 'DashboardController'
        },
        'header': {
          templateUrl: 'app/main/main.header.html',
          controller: 'MainController'
        },
        'footer': {
          templateUrl: 'app/main/main.footer.html',
          controller: 'MainController'
        }
      }
    })
  .state('roadmapTemplate', {
    url: '/roadmaps',
    views: {
      'content': {
        templateUrl: 'app/roadmaps/roadmaps.content.html',
        controller: 'RoadMapsController'
      },
      'header': {
        templateUrl: 'app/main/main.header.html',
        controller: 'RoadMapsController'
      },
      'footer': {
        templateUrl: 'app/main/main.footer.html',
        controller: 'RoadMapsController'
      }
    }
  })

});