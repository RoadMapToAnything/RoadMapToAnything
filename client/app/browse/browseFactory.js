angular.module('browse.factory', ['services.server'])
.factory('Browse', ['Server', function(Server){

  var mapData =[];
  var showSigninMsg = false;

  var getMapData = function(cb){
    var mapData = Server.getRoadmaps({sort: '-bestRating'})
    .then(function(data){
      cb(data);
    });
  };

  var orderMaps = function(mapData, criteria){
    if (!criteria){
      criteria = 'created';
    }
    return mapData[criteria];
    
  }

  return {
    getMapData: getMapData,
    orderMaps: orderMaps
  };
  

}]);
