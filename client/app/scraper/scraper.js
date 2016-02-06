angular.module('scraper.ctrl', ['services.request'])


.controller('ScraperController', [ '$scope', 'Request', function($scope, Request){

$('#scrape-results').append('Hello World!');

Request.get('/scrape/node', {url: 'http://benalman.com/news/2010/11/immediately-invoked-function-expression/'})
.then(function (data) {
  console.log('TEST', data);
});

}]);
