angular.module('roadmaps.ctrl', ['roadmaps.factory', 'services.server', 'services.user'])

.controller('RoadMapsController', [ '$scope', '$http', '$stateParams', 'RoadMapsFactory', 'Server', 'User', '$timeout', function($scope, $http, $stateParams, RoadMapsFactory, Server, User, $timeout){  
  angular.extend($scope, RoadMapsFactory);

  var roadmapId = $stateParams.roadmapID;
  $scope.currentRoadMapData = {};
  $scope.renderedNodes = [];

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

  };

}]);