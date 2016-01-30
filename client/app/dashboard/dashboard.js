angular.module('dash.ctrl', ['services.user'])

.controller('DashboardController', ['$scope','$http', '$state', 'User', function($scope, $http, $state, User){
  $scope.followed = [];
  $scope.myMaps = [];
  $scope.completed = [];

  $scope.showFollowed = true;
  $scope.showMyMaps = false;
  $scope.showCompleted = false;

  //helper functions

  $scope.changeToFollowed = function(){
    $scope.showFollowed = true;
    $scope.showMyMaps = false;
    $scope.showCompleted = false;
    angular.element( '#myMapsBtn' ).removeClass( 'pressed' );
    angular.element( '#followedBtn' ).addClass( 'pressed' );
    angular.element( '#completedBtn' ).removeClass( 'pressed' );
  };

  $scope.changeToMyMaps = function(){
    $scope.showFollowed = false;
    $scope.showMyMaps = true;
    $scope.showCompleted = false;
    angular.element( '#myMapsBtn' ).addClass( 'pressed' );
    angular.element( '#followedBtn' ).removeClass( 'pressed' );
    angular.element( '#completedBtn' ).removeClass( 'pressed' );
  };

  $scope.changeToCompleted = function(){
    $scope.showFollowed = false;
    $scope.showMyMaps = false;
    $scope.showCompleted = true;
    angular.element( '#myMapsBtn' ).removeClass( 'pressed' );
    angular.element( '#followedBtn' ).removeClass( 'pressed' );
    angular.element( '#completedBtn' ).addClass( 'pressed' );
  };

  User.getData()
  .then(function (user) {
    $scope.user = user;
    $scope.myMaps = user.authoredRoadmaps;
    $scope.followed = user.inProgress.roadmaps;
    $scope.completed = user.completedRoadmaps;

    $scope.followed.forEach(function (map){
      var progress = User.getProgress(user, map._id);
      map.nodesCompleted = progress.completed;
      map.percentComplete = progress.percent;
    });
  });

  // $scope.addTotalNodesOfMaps = function (arr){
  //   arr.forEach(function(map){
  //     map.totalNodes = map.nodes.length;
  //   });
  // };

  // $scope.getDashData = function(){
  //   $http.get('/api/users/' + localStorage.getItem('user.username') )
  //   .then( 
  //     // on success
  //     function( response ) {
  //       $scope.myMaps = response.data.data.authoredRoadmaps || [];
  //       $scope.followed = response.data.data.inProgress.roadmaps || [];
  //       $scope.completed = response.data.data.completedRoadmaps || [];
  //       $scope.addTotalNodesOfMaps($scope.myMaps);
  //       $scope.addTotalNodesOfMaps($scope.followed);
  //       $scope.addTotalNodesOfMaps($scope.completed);

  //       $scope.addCompletedNodes(response.data.data.inProgress);
  //   }, // on failure
  //     function( err ){
  //       console.log("error with dashData request", err);
  //     }
  //   );
  // };

  // $scope.addCompletedNodes = function(inProgressObj){
  //   $scope.followed.forEach(function(map){
  //     map.nodesCompleted = $scope.calcCompletedNodes( inProgressObj, map._id );
  //     map.percentComplete = Math.floor(( map.nodesCompleted / map.totalNodes ) * 100);
  //   });

  // };

  // $scope.calcCompletedNodes = function(inProgressObj, mapID){
  //   var count = 0;
  //   var roadmapNodeIDs = [];

  //   //iterate through the map's nodes and get array of IDs
  //   inProgressObj.roadmaps.forEach(function(map){
  //     if(map._id === mapID){
  //       map.nodes.forEach(function(node){
  //         roadmapNodeIDs.push(node._id);
  //       });
  //     }
  //   });
  //   //check those node IDs against the inProgess node IDs
  //   inProgressObj.nodes.forEach(function(node){
  //     if(roadmapNodeIDs.indexOf(node._id) !== -1){
  //       count++;
  //     }
  //   });

  //   return count;
  // };

  $scope.goToMap = function (mapID){  //refactor to factory, browse also uses
    localStorage.setItem('roadmap.id', mapID);
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
        function(response){
          console.log('failed to delete');
          console.log('status', response.status);
          console.log('response', response);
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
          console.log('failed to delete');
          console.log('status', response.status);
          console.log('response', response);
        });
  };

// make ajax calls to get table data
  // $scope.getDashData();

}]);


