angular.module('browse.factory', ['services.server'])
.factory('Browse', ['Server', function(Server){

  var mapData =[];
  var showSigninMsg = false;

  var addTotalNodesOfMaps = function (arr){
    arr.forEach(function(map){
      map.totalNodes = map.nodes.length;
    });
  };

  var getMapData = function(cb){
    var mapData = Server.getRoadmaps({sort: '-created'})
    .then(function(data){
      addTotalNodesOfMaps(data);
      console.log(data);
      cb(data);
    });
  };

  return {
    addTotalNodesOfMaps: addTotalNodesOfMaps,
    getMapData: getMapData
  };
  

}]);
