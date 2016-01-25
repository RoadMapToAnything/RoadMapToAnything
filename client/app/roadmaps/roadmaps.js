angular.module('app.roadmaps', [])
// Roadmaps have a title, description, author, nodes array, all nodes: , created time
  //
.controller('RoadMapsController', function($scope,$http){
  var roadMapUrl = 'testString';
  $scope.currentRoadMapData = {};
  // Get Data
  $scope.encapsulate = function(){  
    $http({
      method: 'GET',
      url: roadMapUrl
    }).then(function(response){
      $scope.currentRoadMapData = response.data;
    }, function(err){
      if (err) return err;
    });
  }
  $scope.renderedNodes = [{nodeDescription: 'Test Description of what Node is about', nodeTitle: 'This node is the best node'}, 
    {nodeDescription: 'Test Description of what Node is about', nodeTitle: 'This node is the worst node' }];
  $scope.renderNodes = function(){

  };

  // Render Title
  // Assumes title links and description properties from get method
  $scope.renderTitleAndLinks = function(){
    var title = $scope.currentRoadMapData.title || 'test title';
    var links = $scope.currentRoadMapData.links || ['testlink1', 'testlink2'];
    var description = $scope.currentRoadMapData.longDescription || 'Test Description of what Node is about';
    console.log(title);
    console.log(links)
    $scope.currentTitle = title;
    $scope.currentLinks = links;
    $scope.currentNodeLongDescription = description;
  }
  $scope.renderTitleAndLinks();

  $scope.selectNode = function() {
    alert('clicked node once we get data will fill in')
    // select clicked node as current
    // $scope.currentTitle = this.title;
    // $scope.currentLinks = this.links;
  }


  $scope.connectLines = function(){
      console.log($('.endPointForConnection'));
      $('.endPointForConnection').connections();
  };
  // We need async because ng-repeat creates the nodes before this function runs set timeout changes the loop.
  $scope.asyncConnectLines = function(cb){
    setTimeout($scope.connectLines,0);
  }
  $scope.asyncConnectLines();
  
  // $scope.connectLines();
    


});