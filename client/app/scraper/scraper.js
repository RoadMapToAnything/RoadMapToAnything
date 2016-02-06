angular.module('scraper.ctrl', ['services.server'])


.controller('ScraperController', [ '$scope', 'Server', function($scope, Server){

  $('#scrape-results').append('Hello World!');

  Server.scrape('http://www.dcbeekeepers.org/')
  .then(function (data) {
    console.log('TEST', data);
  });

}]);
