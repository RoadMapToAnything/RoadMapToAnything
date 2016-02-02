angular.module('roadmaps.ctrl', ['roadmaps.factory', 'services.server', 'services.user'])

.controller('RoadMapsController', [ '$scope', '$http', '$stateParams', 'RoadMapsFactory', 'Server', 'User', '$timeout', function($scope, $http, $stateParams, RoadMapsFactory, Server, User, $timeout){  
  angular.extend($scope, RoadMapsFactory);

  var roadmapId = $stateParams.roadmapID;
  $scope.currentRoadMapData = {};
  $scope.renderedNodes = [];

  // $scope.count = 0;

  // $scope.count = $scope.currentRoadMapData.upvotes;

 //get current count of votes
 $scope.renderCount = function(){
   var upvotes = $scope.currentRoadMapData.upvotes;
   $scope.upvotesCount = 0;
   for(var i = 0; i < upvotes.length; i++){
    $scope.upvotesCount++;
   }
   return $scope.upvotesCount;
 } 

 // Renders the nodes for the current roadmap to the page
  $scope.renderNodes = function(){
    var title = $scope.currentRoadMapData.title || 'test title';
    var nodes = $scope.currentRoadMapData.nodes || ['testnode1', 'testnode2'];  
    var count =   $scope.currentRoadMapData.upvotes;
    // Add an index to nodes to make ng-clicking easier
    nodes.map(function(node,index){
      node.index = index;
    });

    $scope.renderedNodes = nodes;
    $scope.roadMapTitle = title;
    // $scope.currentCount = count;

    // User Logged in Data in the future
    // Some variable that holds that the user is logged in
    $scope.currentNode = nodes[0];
    $scope.renderCurrentNode();
    $scope.currentCount = $scope.renderCount();
  };


  // When roadmap (identified by its id) data is fetched, set it
  Server.getRoadmapById(roadmapId).then(function (res){
      $scope.currentRoadMapData = res;
    }, function(err){
      if (err) return console.log(err);
    })
    .then(function(){
      console.log($scope.currentRoadMapData);
      $scope.renderNodes();
  });

  // Render Title
  // Assumes title links and description properties from get method
  $scope.renderCurrentNode = function(){
    // For now lets make $scope.loggedIn be false, if logged in we can change it to true later.
    $scope.loggedin = false;
    if($scope.loggedIn) {
      // Get node index
      // set currentNode into node at that index;
    } else {
      //links from a node
      var links = $scope.renderedNodes[0].resourceURL;
      //description of a node
      var description = $scope.renderedNodes[0].description;
      var title = $scope.renderedNodes[0].title;
    }
    
    $scope.currentTitle = title;
    $scope.currentLinks = [links];
    $scope.currentNodeDescription = description;

    $scope.connectAllNodes()
  }

  $scope.selectNode = function(index) {

    var links = $scope.renderedNodes[index].resourceURL;
    var description = $scope.renderedNodes[index].description;
    var title = $scope.renderedNodes[index].title;

    $scope.currentIndex = index;
    $scope.currentTitle = title;
    $scope.currentLinks = [links];
    $scope.currentNodeDescription = description;
    $scope.currentNode = $scope.renderedNodes[index];
    
  };
  // Submits a node to the user's inProgress.nodes array.
  $scope.submitCompletedNode = function() {
    console.log('NODE IS SUBMITTED');
    var nodeId = $scope.currentNode._id;
    User.completeNodeById(nodeId);
  }

  // Submits a roadmap to the user's completedRoadmaps array.
  $scope.submitCompletedRoadmap = function() {
    console.log('ROADMAP IS SUBMITTED');
    User.completeRoadmapById(roadmapId);
  }


  $scope.connectAllNodes = function () {
    $timeout(10, function(){
    console.log('connecting nodes');
      var length = $scope.renderedNodes.length - 2;
      for( var i = 0; i < length; i++ ){
        var nodeA = '#node-' + i;
        var nodeB = '#node-' + (i+1);
        console.log('nodeA', $(nodeA));
        console.log('nodeB', $(nodeB));
        $(nodeA).connections({ to: nodeB });
        $(nodeA).css("background-color","blue");
        $(nodeB).css("background-color","blue");
      }
    })

  // Submits a username to the roadmap's upVoteBy array
  $scope.upVoteMap = function () {
    console.log('UPVOTE IS SUBMITTED');
    // Get the current logged in user's username
    User.getData().then(function(data) {
      var username = data.username;
      // console.log('THIS IS THE USER', username);
      // console.log('this is the roadmap id', roadmapId);
      // Post the username to the roadmap's upVoteBy array
      $scope.sendUpVote(roadmapId, username)
      // On success, update the upvote count on the roadmap page
      // .then(function() {})
      // .then(function(){
      //   console.log('THE COUNT IN THE CONTROLLER!!!!', $scope.count);
      // })
    .then(function(data){ 
        // var count = 0;
        var usersUpvoted = data.data.upvotes;
        // var count = 0;
          console.log('THIS IS DATA SENT BACK FROM SERVER:', data)
          console.log('UPVOTES FROM USERS:', usersUpvoted);
          //iterate over upvotes made from users array to get a count of upvotes
          // for(var i = 0; i < usersUpvoted.length; i++){
          //   $scope.count++;
          // }
          // console.log('CURRENT COUNT,', $scope.count, usersUpvoted);
         
           $scope.upvotesCount = 0;
           for(var i = 0; i < usersUpvoted.length; i++){
            $scope.upvotesCount++;
           }
          $scope.currentCount = $scope.upvotesCount;
      })
    })
}


  // Submits a username to the roadmap's downVoteBy array
  // $scope.downVoteMap = function () {
  //   console.log('DOWNVOTE IS SUBMITTED');
  //   // Get the current logged in user's username
  //   User.getData().then(function(data) {
  //     var username = data.username;
  //     console.log('THIS IS THE USER', username);
  //     // Post the username to the roadmap's upVoteBy array
  //     // sendDownVote(roadmapId, username)
  //     // // On success, update the upvote count on the roadmap page
  //     // .then(function() {})
  //     // // On error, send error
  //     // .catch()
  //   })
  // }

  $scope.connectLines = function(){
    $('.endPointForConnection').connections();
  };


  };


}]);