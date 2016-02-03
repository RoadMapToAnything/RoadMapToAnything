angular.module('roadmaps.factory', [])

  .factory('RoadMapsFactory', function($http){

    var sendUpVote = function(id, username) {
      // Post request to database to update roadmap model to add username in upvotes array
      return $http.post('/api/roadmaps/' + id + '/upvote', {username: username})
    }

    var sendDownVote = function(id, username) {
      console.log('downvote http request sent');
      // Post request to database to update roadmap model to remove username in upvotes array
      return $http.post('/api/roadmaps/' + id + '/downvote', {username: username});
    }

    return {
      sendUpVote : sendUpVote,
      sendDownVote : sendDownVote
    };
   });