angular.module('scraper.ctrl', ['services.server'])


.controller('ScraperController', [ '$scope', 'Server', function($scope, Server){
  $scope.urlToScrape = '';
  $scope.displayUrl = '';
  $scope.scrape = {};


  $scope.checkAndSubmit = function() {
    var url = $scope.urlToScrape;
    if (url.length < 4) return;
    if (url.substring(0, 4) !== 'http') url = 'http://' + url;

    $scope.displayUrl = url;

    Server.scrape(url)
    .then(function (data) {
      $scope.scrape = data;
    });
  };

}]);
