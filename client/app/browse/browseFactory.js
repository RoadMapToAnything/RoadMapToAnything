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
  }

  var addMapToEmbarked = function(mapID) {
    var username = localStorage.getItem('user.username');
    var user = {'user.username': username, 'inProgress.roadmaps': mapID }
    Server.updateUser(user);
  }

  var gotToMap = function(mapID){
    localStorage.setItem('roadmap.id', mapID);
    $state.go('home.roadmapTemplate');
  }

  return {
    addTotalNodesOfMaps: addTotalNodesOfMaps,
    getMapData: getMapData,
    addMapToEmbarked: addMapToEmbarked,
    gotToMap: gotToMap
  }
  

}])