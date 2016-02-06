angular.module('scraper.ctrl', ['services.request'])


.controller('ScraperController', [ '$scope', 'Request', function($scope, Request){

$('#scrape-results').append('Hello World!');

Request.get('/scrape/node', {url: 'http://www.w3schools.com/js/js_function_closures.asp'})
.then(function (data) {
  console.log('TEST', data);
});

}]);
