angular.module('app.dash')
  .factory('DashboardFactory',['$http','$state', function($http, $state){
  return {

    getDashData : function(){

      return $http.get('/api/users/' + localStorage.getItem('user.username') )
        .then( 
          // on success
          function( response ) {
            var dashData = {
              myMaps : response.data.data.authoredRoadmaps || [],
              followed : response.data.data.inProgress.roadmaps || [],
              completed : response.data.data.completedRoadmaps || []
            };


            addTotalNodesOfMaps(dashData.myMaps);
            addTotalNodesOfMaps(dashData.followed);
            addTotalNodesOfMaps(dashData.completed);

            addCompletedNodes(response.data.data.inProgress, dashData);

            return dashData;
      }, // on failure
        function( response ){
          console.log("error with dashData request", err);
        }
      );

      function addTotalNodesOfMaps (arr){
        arr.forEach(function(map){
          map.totalNodes = map.nodes.length;
        });
      };

      function addCompletedNodes (inProgressObj, dashData){
        dashData.followed.forEach(function(map){
          map.nodesCompleted = calcCompletedNodes( inProgressObj, map._id );
          map.percentComplete = Math.floor(( map.nodesCompleted / map.totalNodes ) * 100);
        });
      };

      // to be added to User factory:
      function calcCompletedNodes (inProgressObj, mapID){
        var count = 0;
        var roadmapNodeIDs = [];

        // get array of IDs for the nodes attached to a map in progress
        inProgressObj.roadmaps.forEach(function(map){
          if(map._id === mapID){
            map.nodes.forEach(function(node){
              roadmapNodeIDs.push(node._id);
            });
          }
        });
        // check those IDs against the inProgess node IDs
        inProgressObj.nodes.forEach(function(node){
          if(roadmapNodeIDs.indexOf(node._id) !== -1){
            count++;
          }
        });

        return count;
      };
    },

    goToMap : function (mapID){
      localStorage.setItem('user.currentRoadMap', mapID);
      $state.go('roadmapTemplate');
    },
    
    deleteMap : function(mapID){
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
            this.getDashData();
          },
          function(response){
            console.log('failed to delete');
            console.log('status', response.status);
            console.log('response', response);
          });
    }
  }
}]);
