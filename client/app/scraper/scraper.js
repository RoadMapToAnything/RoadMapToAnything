angular.module('scraper.ctrl', ['services.request'])


.controller('ScraperController', [ '$scope', 'Request', function($scope, Request){

$('#scrape-results').append('Hello World!');

Request.get('/scrape/node', {url: 'http://www.google.com/'})
.then(function (data) {
  console.log('TEST', data);
})

}]);
