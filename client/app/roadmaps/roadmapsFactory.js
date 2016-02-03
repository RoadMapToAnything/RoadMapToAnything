angular.module('roadmaps.factory', [])

  .factory('RoadMapsFactory', function($http){

       var sendUpVote = function(id, username) {
      // Send a data boolean in the body?
      // Post request to database to update roadmap model to include username in downvotes array...
       return $http.post('/api/roadmaps/' + id + '/upvote', {username: username})
      //  .then(function(data){ 
      //   // var count = 0;
      //   var usersUpvoted = data.data.upvotes;
      //   // var count = 0;
      //     console.log('THIS IS DATA SENT BACK FROM SERVER:', data)
      //     console.log('UPVOTES FROM USERS:', usersUpvoted);
      //     //iterate over upvotes made from users array to get a count of upvotes
      //     for(var i = 0; i < usersUpvoted.length; i++){
      //       count++;
      //     }
      //     console.log('THE COUNT IN THE FACTORY,', count, usersUpvoted);
      // })
    }


    var sendDownVote = function(id, username) {
      // Send a data boolean in the body?
      console.log('downvote http request sent');
      // Post request to database to update roadmap model to include username in downvotes array...
       return $http.post('/api/roadmaps/' + id + '/downvote', {username: username});
       //.then?
       //.catch?
    }


    return {
      // upvotes : upvotes,
      // count : count,
      // downvotes : downvotes,
      sendUpVote : sendUpVote,
      sendDownVote : sendDownVote
    };
   });