angular.module('roadmaps.factory', [])

  .factory('RoadMapsFactory', function($http){

    // Votes count to be displayed on roadmap page
    var upvotes;
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

    var sendUpVote = function(id, username) {
      console.log('THIS IS SEND UP VOTE FROM FACTORY');
      // Send a data boolean in the body?
      // Post request to database to update roadmap model to include username in upvotes array...
       return $http({
        method: 'POST',
        url: '/api/roadmaps/' + id
        // ,
        // data: username
        })
       //.then?
       //.catch?
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
      // downvotes : downvotes,
      sendUpVote : sendUpVote
      // sendDownVote : sendDownVote
    };
   });