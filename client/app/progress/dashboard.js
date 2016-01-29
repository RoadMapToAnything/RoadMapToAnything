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

  $scope.addTotalNodesOfFollowedMaps = function (arr){
    console.log('followed arr', Array.isArray(arr));
    arr.forEach(function(map){
      console.log('followed totalNodes', map.nodes.length);
      map.totalNodes = map.nodes.length;
    });
  };

  $scope.addTotalNodesOfMyMaps = function (arr){
    console.log('myMaps arr', Array.isArray(arr));
    arr.forEach(function(map){
      console.log('totalNodes for myMaps', map.nodes.length);
      map.totalNodes = map.nodes.length;
    });
  };

  $scope.getMyMaps = function (){
      console.log('calling getMyMaps');
  //    $http.get('http://roadmaptoanything.herokuapp.com/#/api/users/' + $scope.userName )
        $http.get('/api/users/' + localStorage.getItem('user.username') )
          .then(function(response){
              console.log('myMaps response.data', response.data);
              $scope.myMaps = response.data.data.authoredRoadmaps || [];
              $scope.addTotalNodesOfMyMaps($scope.myMaps);
            }, function(err){
              console.log("error with MyMaps request", err);
            });
    };

  $scope.getFollowedMaps = function (){
      console.log('calling getFollowedMaps');
  //    $http.get('http://roadmaptoanything.herokuapp.com/#/api/users/' + $scope.userName )
        $http.get('/api/users/' + localStorage.getItem('user.username') )
          .then(function(response){
              console.log('followed response.data', response.data);
              $scope.followed = response.data.data.inProgress.roadmaps || [];
              $scope.addTotalNodesOfFollowedMaps($scope.followed);
              $scope.addCompletedNodes(response.data.data.inProgress)
            }, function(err){
              console.log('error with followedMaps request', err);
            });
    };


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
    console.log('followedData', followedData);
    console.log('mapID');
    //iterate through the map's nodes and get array of IDs
    followedData.roadmaps.forEach(function(map){
      if(map._id === mapID){
        map.nodes.forEach(function(node){
          roadmapNodeIDs.push(node._id);
        });
      }
    });

    //check those node IDs against the inProgess node IDs
      //iterate count when there's a match
    followedData.nodes.forEach(function(node){
      if(roadmapNodeIDs.indexOf(node._id) !== -1){
        count++;
      }
    });

    return count;
  };

  $scope.getDashboardData = function(){
    angular.element(document).ready( function(){
        $scope.getMyMaps();
        $scope.getFollowedMaps();
      });
  };

  $scope.goToMap = function (mapID){  //refactor to factory, browse also uses
    console.log('go to map', mapID);
    localStorage.setItem('roadmap.id', mapID);
    $state.go('roadmapTemplate');
  }
  
  $scope.deleteMapIMade = function(mapID){
    var user = localStorage.getItem('user.username');
    var token = localStorage.getItem('user.authToken');
    console.log('token', token);
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
          console.log('deleted');
          $scope.getMyMaps();
        },
        function(response){
          console.log('failed to delete');
          console.log('status', response.status);
          console.log('response', response);
        })
  }

  $scope.deleteFollowedMap = function(mapID){
    var user = localStorage.getItem('user.username');
    var token = localStorage.getItem('user.authToken');
    console.log('token', token);
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
          console.log('deleted');
          $scope.getFollowedMaps();
        },
        function(response){
          console.log('failed to delete');
          console.log('status', response.status);
          console.log('response', response);
        })
  }
//make ajax calls to get table data
  $scope.getDashboardData();

}]);


