angular.module('app', [
  'ui.router',
  'main.ctrl',
  'auth.ctrl',
  'dash.ctrl',
  'roadmaps.ctrl',
  'browse.ctrl',
  'creation.ctrl',
  'scraper.ctrl'

  ])
.run( function($rootScope, $state){
  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
    if( !localStorage.getItem('user.username') && toState.auth === true ){
      event.preventDefault();
      alert('please log in first');
      $state.go('signin');
    }
  });
})
.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
  $urlRouterProvider.otherwise('/');
  $stateProvider
    //state for the main home page that signed-in and non-signed in users see
    .state('home', {
      url: '/',
      views: {
        'content': {
          templateUrl: 'app/main/main.html',
          controller: 'MainController'
        },
        'header': {
          templateUrl: 'app/main/header.html',
          controller: 'MainController'
        },
         'welcome@home': {
          templateUrl: 'app/main/welcome.html',
          controller: 'MainController'
        },
         'featured': {
          templateUrl: 'app/main/welcome.html',
          controller: 'MainController'
        },
        'browse@home': {
          templateUrl: 'app/browse/browse.html',
          controller: 'BrowseController',
        },
        'footer': {
          templateUrl: 'app/main/footer.html',
          controller: 'MainController'
        },
        'authModal' : {
          templateUrl: 'app/modals/authorization.html',
          controller: 'AuthController'
        },
        'creationModal' : {
          templateUrl: 'app/modals/creation.html',
          controller: 'CreationController'
        },
        'imageSubmitModal' : {
          templateUrl: 'app/modals/imageSubmit.html',
          controller: 'DashboardController'
        }
      }
    })
    //state for dashboard
    .state('home.dashboard', {
      auth: true,
      url: 'dashboard/:type',
      views: {
        'content@': {
          templateUrl: 'app/dashboard/dashboard.html',
          controller: 'DashboardController'
        }
      }
    })
  //state for roadmap
  .state('home.roadmapTemplate', {
    auth: true,
    url: 'roadmaps/:roadmapID',
    views: {
      'content@': {
        templateUrl: 'app/roadmaps/content.html',
        controller: 'RoadMapsController'
      }
    }
  })
  .state('home.scraper', {
    url: 'scraper',
    views: {
      'content@': {
        templateUrl: 'app/scraper/scraper.html',
        controller: 'ScraperController'
      }
    }
  })
      //To get nested subviews the pattern is desiredViewName@stateName
      // 'roadmapCreator@roadmapCreation': {
      //   templateUrl: 'app/roadmaps/roadmaps.creationForm.html',
      //   controller: 'CreationController'
      // },
      // 'nodeCreator@roadmapCreation': {
      //   templateUrl: 'app/roadmaps/node.creation.html',
      //   controller: 'CreationController'
      // },
  .state('home.browse', { //maybe rename as explore?
    url: 'browse',
    views: {
      'content@': {
        templateUrl: 'app/browse/browse.html',
        controller: 'BrowseController'
      }
    }
  })

  .state('/about', { //maybe rename as explore?
      url: '/about',
      views: {
        'content@': {
          templateUrl: 'app/main/about.html',
          controller: 'MainController'
        }
      }
    });
});