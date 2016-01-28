angular.module('app.roadmaps', [])
// Roadmaps have a title, description, author, nodes array, all nodes: , created time
  //
.controller('RoadMapsController', function($scope,$http){
  // Changes everytime you reseed database

  var roadmapId = localStorage.getItem('user.currentRoadMap') || '56a975b3d4c025716aa9900d';

  $scope.currentRoadMapData = {};
  $scope.renderedNodes = [];
  
  $scope.renderNodes = function(){
    var title = $scope.currentRoadMapData.title || 'test title';
    var nodes = $scope.currentRoadMapData.nodes || ['testnode1', 'testnode2'];    
    // add an index to nodes to make ng-clicking easier.
    nodes.map(function(node,index){
      node.index = index;
    })


    $scope.renderedNodes = nodes;
    $scope.roadMapTitle = title;
    // User Logged in Data in the future
    // some variable that holds that the user is logged in
    $scope.currentNode = nodes[0];
    $scope.renderCurrentNode();
  };

  // Render Title
  // Assumes title links and description properties from get method
  $scope.renderCurrentNode = function(){
    // For now lets make $scope.loggedIn be false, if logged in we can change it to true later.
    $scope.loggedin = false;
    if($scope.loggedIn) {
      // Get node index
      // set currentNode into node at that index;
    } else {
      var links = $scope.renderedNodes[0].resourceURL;
      var description = $scope.renderedNodes[0].description;
      var title = $scope.renderedNodes[0].title;
    }
    
    $scope.currentTitle = title;
    $scope.currentLinks = [links];
    $scope.currentNodeDescription = description;

    $scope.connectLines();


    // var links = $scope.currentRoadMapData.nodes.resourceURL || ['testlink1', 'testlink2'];
    // //gets you the description of a particular node
    // var description = $scope.currentRoadMapData.nodes.description || 'Test Description of what Node is about';
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

  // The roadMap URL is just for testing purposes and gets you a specific roadmap
  // We can just use /api/roadmaps to get every node
  $scope.getRoadMap = function(cb){  
    return $http({
      method: 'GET',
      url: '/api/roadmaps/' + roadmapId
    }).then(function(response){
      $scope.currentRoadMapData = response.data.data;
      cb()
    }, function(err){
      if (err) return err;
    });
  };

  // Submits a node to the user's inProgress.nodes array.
  $scope.submitCompletedNode = function() {
    var username = localStorage.getItem('username') || 'bowieloverx950';
    var nodeId = $scope.currentNode._id;

    $http({
      method: 'PUT',
      url: '/api/users/' + username,
      data: {'inProgress.nodes': nodeId}
    })
    .then(function (res) {
      console.log('Node added to inProgress.nodes:', res.data.data.inProgress.nodes);
    });
  };


  // Submits a roadmap to the user's completedRoadmaps array.
  $scope.submitCompletedRoadmap = function() {
    var username = localStorage.getItem('username') || 'bowieloverx950';

    $http({
      method: 'PUT',
      url: '/api/users/' + username,
      data: {completedRoadmaps: roadmapId}
    })
    .then(function (res) {
      console.log('Roadmap added to completedRoadmaps:', res.data.data.completedRoadmaps);
    });
  };


  $scope.connectLines = function(){
      console.log($('.endPointForConnection'));
      $('.endPointForConnection').connections();
  };
  // We need async because ng-repeat creates the nodes before this function runs set timeout changes the loop.
  $scope.asyncConnectLines = function(cb){
    setTimeout($scope.connectLines,0);
  };
  
  // $scope.connectLines();
  $scope.getRoadMap($scope.renderNodes);

// This is for the roadMap Creation Form

$scope.createRoadMap = function(data){
  data.author = localStorage.getItem('currentUser') || 'testAuthor';
  
 return $http({
      method: 'POST',
      url: '/api/roadmaps',
      data: data
    }).then(function(response){
      console.log(response.data.data)
      localStorage.setItem('roadmapId', response.data.data.id)
    }, function(err){
      if (err) return err;
    });
};



});