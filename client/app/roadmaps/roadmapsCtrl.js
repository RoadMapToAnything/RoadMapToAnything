angular.module('roadmaps.ctrl', ['roadmaps.factory', 'services.server', 'services.user'])

.controller('RoadMapsController', [ '$scope', '$http', '$stateParams', 'RoadMapsFactory', 'Server', 'User', '$timeout', '$state', function($scope, $http, $stateParams, RoadMapsFactory, Server, User, $timeout, $state){  
  angular.extend($scope, RoadMapsFactory);

  var roadmapId = $stateParams.roadmapID;
  $scope.currentRoadMapData = {};
  $scope.renderedNodes = [];
  $('.tooltipped').tooltip({delay: 50});

 // Get the current number of upvotes from current map
 $scope.getCountVotes = function(votes){
    $scope.votesCount = 0;
    for(var i = 0; i < votes.length; i++){
      $scope.votesCount++;
    }
    return $scope.votesCount;
 } 

 // Renders the nodes for the current roadmap to the page
  $scope.renderNodes = function(){
    var title = $scope.currentRoadMapData.title || 'test title';
    var nodes = $scope.currentRoadMapData.nodes || ['testnode1', 'testnode2'];  
    // Add an index to nodes to make ng-clicking easier
    nodes.map(function(node,index){
      node.index = index;
    });

    $scope.renderedNodes = nodes;
    $scope.roadMapTitle = title;

    // User Logged in Data in the future
    // Some variable that holds that the user is logged in
    $scope.currentNode = nodes[0];
    $scope.renderCurrentNode();
  };


  // When roadmap (identified by its id) data is fetched, set it
  Server.getRoadmapById(roadmapId).then(function (res){
      $scope.currentRoadMapData = res;
    }, function(err){
      if (err) return console.log(err);
    })
    .then(function(){
      $scope.renderNodes();
      // Set the upvotes and downvotes
      var currentMapUpVotes = $scope.currentRoadMapData.upvotes;
      var currentMapDownVotes = $scope.currentRoadMapData.downvotes;
      $scope.upVoteCount = $scope.getCountVotes(currentMapUpVotes);
      $scope.downVoteCount = $scope.getCountVotes(currentMapDownVotes);
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
    var nodeId = $scope.currentNode._id;
    User.completeNodeById(nodeId);
    Materialize.toast('Node Complete!', 4000, 'orangeToast');
  }

  // Submits a roadmap to the user's completedRoadmaps array.
  $scope.submitCompletedRoadmap = function() {
    Materialize.toast('Map Complete!', 4000, 'orangeToast');
    User.completeRoadmapById(roadmapId);
    $state.go('home.dashboard', {type: 'completed'});
  }


  // After upvote, submits vote update to the roadmap's upvotes and downvotes array
  $scope.upVoteMap = function () {
    User.upvoteMapById(roadmapId)
    .then(function(data){ 
      var dataUpVoteCount = data.upvotes;
      var dataDownVoteCount = data.downvotes;
      // Update the upvote count
      $scope.upVoteCount = $scope.getCountVotes(dataUpVoteCount);
      // Update the downvote count
      $scope.downVoteCount = $scope.getCountVotes(dataDownVoteCount);
    })
  }

  // After downvote, submits vote update to the roadmap's upvotes and downvotes array
  $scope.downVoteMap = function () {
    User.downvoteMapById(roadmapId)
    .then(function(data){
      var dataUpVoteCount = data.upvotes;
      var dataDownVoteCount = data.downvotes;
      // Update the upvote count
      $scope.upVoteCount = $scope.getCountVotes(dataUpVoteCount);
      // Update the downvote count
      $scope.downVoteCount = $scope.getCountVotes(dataDownVoteCount);
    })
  }

  $scope.connectLines = function(){
    $('.endPointForConnection').connections();
  };

}]);