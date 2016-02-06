angular.module('scraper.ctrl', ['services.request'])


.controller('ScraperController', [ '$scope', 'Request', function($scope, Request){

$('#scrape-results').append('Hello World!');

$.get("https://www.youtube.com/watch?v=Ex4RNBQSTNA").done(function (data) {
    console.log(data);
});

}]);
