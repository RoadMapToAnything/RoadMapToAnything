angular.module('app', [
  'ui.router',
  'app.main',
  'app.auth',
  'app.dash',
  'app.roadmaps',
  'app.browse',
  'app.creation'
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
        'browse': {
          templateUrl: 'app/browse/browse.html',
          controller: 'BrowseController',
        },
        'footer': {
          templateUrl: 'app/main/main.footer.html',
          controller: 'MainController'
        }
      }
    })
    //state for sign-in
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
    //state for sign-up
    .state('signup', {
      views: {
        'content': {
          templateUrl: 'app/auth/signup.html',
          controller: 'AuthController'
        },
        'header': {
          templateUrl: 'app/main/main.registration.html',
          controller: 'MainController'
        },
        'footer': {
          templateUrl: 'app/main/main.footer.html',
          controller: 'MainController'
        }
      }
    })
    //state for dashboard
    .state('dashboard', {
      auth: true,
      url: '/dashboard',
      views: {
        'content': {
          templateUrl: 'app/progress/dashboard.html',
          controller: 'DashboardController'
        },
        'header': {
          templateUrl: 'app/main/main.userheader.html',
          controller: 'MainController'
        },
        'footer': {
          templateUrl: 'app/main/main.footer.html',
          controller: 'MainController'
          }
        }
    })
  //state for roadmap
  .state('roadmapTemplate', {
    auth: true,
    url: '/roadmaps',
    views: {
      'content': {
        templateUrl: 'app/roadmaps/roadmaps.content.html',
        controller: 'RoadMapsController'
      },
      'header': {
        templateUrl: 'app/main/main.userheader.html',
        controller: 'RoadMapsController'
      },
      'footer': {
        templateUrl: 'app/main/main.footer.html',
        controller: 'RoadMapsController'
      }
    }
  })
  .state('roadmapCreation', {
    auth: true,
    url: '/roadmapCreation',
    views: {
      'content': {
        templateUrl: 'app/roadmaps/roadmaps.creationFormMaster.html',
        controller: 'CreationController'
      },
      //To get nested subviews the pattern is desiredViewName@stateName
      'roadmapCreator@roadmapCreation': {
        templateUrl: 'app/roadmaps/roadmaps.creationForm.html',
        controller: 'CreationController'
      },
      'nodeCreator@roadmapCreation': {
        templateUrl: 'app/roadmaps/node.creation.html',
        controller: 'CreationController'
      },
      'header': {
        templateUrl: 'app/main/main.userheader.html',
        controller: 'MainController'
      },
      'footer': {
        templateUrl: 'app/main/main.footer.html',
        controller: 'MainController'
      },
    }
  })
  .state('example', {
    url: '/example',
    views: {
      'signup': {
        templateUrl: 'app/auth/signup.html',
        controller: 'AuthController' 
      },
      'header': {
        templateUrl: 'app/main/main.userheader.html',
        controller: 'RoadMapsController'
      },
      'footer': {
        templateUrl: 'app/main/main.footer.html',
        controller: 'RoadMapsController'
      }
    }
  })
  .state('browse', { //maybe rename as explore?
    url: '/browse',
    views: {
      'content': {
        templateUrl: 'app/browse/browse.html',
        controller: 'BrowseController'
      },
      'header': {
        templateUrl: 'app/main/main.userheader.html',
        controller: 'MainController'
      },
      'footer': {
        templateUrl: 'app/main/main.footer.html',
        controller: 'MainController'
      }
    }
  });
});