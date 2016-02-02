angular.module('roadmaps.factory', [])

  .factory('RoadMapsFactory', function($http){

    // Votes count to be displayed on roadmap page
    var upvotes;
    // var count = 0;

    // var downvotes;

  //    Server.createRoadmap = function(roadmap) {

  //  return $http({
  //     method: 'POST',
  //     url: '/api/roadmaps',
  //     data: roadmap,
  //     headers: { Authorization: 'Basic ' + encodeAuthHeader() }
  //   })
  //   .then(standardResponse)
  //   .catch(standardError);
  // };

    // var sendUpVote = function(id, username) {
    //   console.log('THIS IS SEND UP VOTE FROM FACTORY');
    //   // Send a data boolean in the body?
    //   // Post request to database to update roadmap model to include username in upvotes array...
    //    return $http({
    //     method: 'POST',
    //     url: '/api/roadmaps/' + id
    //     // ,
    //     // data: username
    //     })
    //    //.then?
    //    //.catch?
    // }

       var sendUpVote = function(id, username) {
      // Send a data boolean in the body?
      // Post request to database to update roadmap model to include username in downvotes array...
       return $http.post('/api/roadmaps/' + id, {username: username})
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


    // var sendDownVote = function(roadmapId, username) {
    //   // Send a data boolean in the body?
    //   // Post request to database to update roadmap model to include username in downvotes array...
    //    return $http.post('/api/roadmaps/' + id);
    //    //.then?
    //    //.catch?
    // }


    return {
      upvotes : upvotes,
      // count : count,
      // downvotes : downvotes,
      sendUpVote : sendUpVote
      // sendDownVote : sendDownVote
    };
   });