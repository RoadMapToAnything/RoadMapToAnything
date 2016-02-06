angular.module('scraper.ctrl', ['services.request'])


.controller('ScraperController', [ '$scope', 'Request', function($scope, Request){

$('#scrape-results').append('Hello World!');

Request.get('/scrape/node', {url: 'https://vimeo.com/channels/staffpicks/153151039'})
.then(function (data) {
  console.log('TEST', data);
});

}]);
