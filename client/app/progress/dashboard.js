angular.module('app.dash', [])

.controller('DashboardController', ['$scope','$http', '$state', function($scope, $http, $state){

  $scope.username = '';

  $scope.followedMapsResponseBody = {};

  $scope.myMapsResponseBody = {};

  $scope.hideMyMaps = true;

  $scope.followed = [];

  $scope.myMaps = [];

  $scope.followedTotalNodes = 0;

  // helper functions

  $scope.showMyMaps = function(){
      $scope.hideMyMaps = false;
      angular.element( '#myMapsBtn' ).addClass( 'pressed' );
      angular.element( '#followedBtn' ).removeClass( 'pressed' );
  };

  $scope.showFollowed = function(){
      $scope.hideMyMaps = true;
      angular.element( '#myMapsBtn' ).removeClass( 'pressed' );
      angular.element( '#followedBtn' ).addClass( 'pressed' );
  };

  $scope.addTotalNodesOfMaps = function (arr){
    arr.forEach(function(map){
      map.totalNodes = map.nodes.length;
    });
  };

  $scope.getDashData = function(){
    $http.get('/api/users/' + localStorage.getItem('user.username') )
    .then( 
      // on success
      function( response ) {
        $scope.myMaps = response.data.data.authoredRoadmaps || [];
        $scope.followed = response.data.data.inProgress.roadmaps || [];
        $scope.completed = response.data.data.completedRoadmaps || [];

        $scope.addTotalNodesOfMaps($scope.myMaps);
        $scope.addTotalNodesOfMaps($scope.followed);
        $scope.addTotalNodesOfMaps($scope.completed);

        $scope.addCompletedNodes(response.data.data.inProgress)
    }, // on failure
      function( response ){
        console.log("error with dashData request", err);
      }
    );
  }

  $scope.addCompletedNodes = function(inProgressObj){
    $scope.followed.forEach(function(map){
      map.nodesCompleted = $scope.calcCompletedNodes( inProgressObj, map._id );
      map.percentComplete = Math.floor(( map.nodesCompleted / map.totalNodes ) * 100);
    });

    $scope.myMaps.forEach(function(map){
      map.nodesCompleted = $scope.calcCompletedNodes( inProgressObj, map._id );
      map.percentComplete = Math.floor(( map.nodesCompleted / map.totalNodes ) * 100);
    });
  };

  $scope.calcCompletedNodes = function(followedData, mapID){
    var count = 0;
    var roadmapNodeIDs = [];

    //iterate through the map's nodes and get array of IDs
    followedData.roadmaps.forEach(function(map){
      if(map._id === mapID){
        map.nodes.forEach(function(node){
          roadmapNodeIDs.push(node._id);
        });
      }
    });
    //check those node IDs against the inProgess node IDs
    followedData.nodes.forEach(function(node){
      if(roadmapNodeIDs.indexOf(node._id) !== -1){
        count++;
      }
    });

    return count;
  };

  $scope.goToMap = function (mapID){  //refactor to factory, browse also uses
    localStorage.setItem('user.currentRoadMap', mapID);
    $state.go('roadmapTemplate');
  };
  
  $scope.deleteMapIMade = function(mapID){
    var user = localStorage.getItem('user.username');
    var token = localStorage.getItem('user.authToken');
    var encodedAuthHeader = btoa(user + ':' + token);

    $http({
      method: 'DELETE',
      url: '/api/roadmaps/' + mapID,
      headers: {
        'Authorization': 'Basic ' + encodedAuthHeader
      }
    })
      .then(
        //success
        function(response){
          console.log('Roadmap deleted:', mapID);
          $scope.getMyMaps();
        },
        function(err){
          console.log('Failed to delete roadmap', err);
        });
  };

  $scope.deleteFollowedMap = function(mapID){
    var user = localStorage.getItem('user.username');
    var token = localStorage.getItem('user.authToken');
    var encodedAuthHeader = btoa(user + ':' + token);

    $http({
      method: 'DELETE',
      url: '/api/roadmaps/' + mapID,
      headers: {
        'Authorization': 'Basic ' + encodedAuthHeader
      }
    })
      .then(
        //success
        function(response){
          console.log('Roadmap deleted:', mapID);
          $scope.getFollowedMaps();
        },
        function(response){
          console.log('Failed to delete roadmap', err);
        })
  };

// make ajax calls to get table data
  $scope.getDashData();

}]);


