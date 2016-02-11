angular.module('roadmaps.ctrl', ['roadmaps.factory', 'services.server', 'services.user', 'scraper.ctrl'])

.controller('RoadMapsController', [ '$scope', '$http', '$stateParams', 'RoadmapsFactory', 'Server', 'User', '$timeout', '$state', function($scope, $http, $stateParams, RoadmapsFactory, Server, User, $timeout, $state){  
  angular.extend($scope, RoadmapsFactory);

  var roadmapId = $stateParams.roadmapID;

  $scope.currentRoadMapData = {};
  $scope.renderedNodes = [];
  $('.tooltipped').tooltip({delay: 50});

  $scope.isAuthor = false;
  $scope.showComments = false;
  $scope.currentIndex = 0;
  $scope.hideTitle = false;
  $scope.hideDesc = false;

  $scope.toggleComments = function(){
    $scope.showComments = !$scope.showComments;
  };

  resetCreationForm();

  $scope.checkAndSubmit = function() {
    var url = $scope.urlToScrape;
    if (url.length < 4) return;
    if (url.substring(0, 4) !== 'http') url = 'http://' + url;

    Server.scrape(url)
    .then(function (data) {
      console.log('web scrape data is', data);
        $scope.currentCreationTitle = data.title;
        $scope.currentCreationDescription = data.description;
        $scope.currentCreationType = data.type;
        $scope.currentCreationLink = url;
        $scope.currentCreationImage = data.imageUrl;
    });
  };

  $scope.showNodeCreator = function($index, boolean){
    $scope.currentAddIndex = $index + 1;
    if( !$scope.isAuthor ){
      $scope.nodeCreator = false;
    } else {
      $scope.displayNodeCreator = boolean;
    }
  }

  $scope.createNode = function($index) {
    console.log($scope.currentCreationImage);
    if( $scope.currentCreationImage === 'New node image (optional)' ){
      $scope.currentCreationImage = NODE_DEFAULTS.imageUrl;
    }
    $('#editor-placeholder').remove();
    console.log("CREATE NODE $index", $index);

    return Server.createNode({
      title: $scope.currentCreationTitle || NODE_DEFAULTS.title,
      description: $scope.currentCreationDescription || NODE_DEFAULTS.description,
      resourceType: $scope.currentCreationType || NODE_DEFAULTS.resourceType,
      resourceURL: $scope.currentCreationLink || NODE_DEFAULTS.resourceURL,
      imageUrl: $scope.currentCreationImage || NODE_DEFAULTS.imageUrl,
      parentRoadmap: roadmapId,
      saveAtIndex: $index

    })
    .then(function(res){
      populateData();
      $scope.displayNodeCreator = false;
      Materialize.toast('Node Added!', 4000, 'orangeToast');
      resetCreationForm();
    });
  };

  $scope.closeNodeCreator = function(){
    $scope.displayNodeCreator = false;
    resetCreationForm();
  }

  $scope.hideText = function (id, $index){
    var elementID = '#' + id + $index;
    if( !$scope.isAuthor ){
      return false;
    } else {
      if( !$scope[elementID] ){
        return  false;
      } else {
        return true;
      }
    }
  };

  $scope.showEditor = function ($index, type, boolean, id){
    var elementID = '#' + id + $index;
    $scope.currentIndex = $index;
    console.log('elementID', elementID);
    if( !$scope.isAuthor ){
      $scope[elementID] = false;
    } else {
      if( type === 'mini-circle'){
        resetCreationForm();
      }
      if( !$scope.currentResourceURL ) {
        $scope.currentResourceURL = $scope.currentLinks[0];
      }

      if(boolean === false && type !== 'circle' && type !== 'mini-circle'){
        $(elementID).val($scope.renderedNodes[$index][type]);
      }

      $scope[elementID] = boolean;
    }


  };

  $scope.getPlaceholder = function($index, field){
    var capitalizedField = field.substr(0, 1).toUpperCase() + field.substr(1);
    return $scope['current' + capitalizedField];
  };

  $scope.saveEdit = function($index, field, idPrefix){
    var elementID = '#' + idPrefix + $index;
    var newProperty = $(elementID).val();
    console.log('newProperty', newProperty);
    var updateObj = {};
    updateObj['_id'] = $scope.renderedNodes[$index]._id;
    updateObj[field] = newProperty;
    Server.updateNode(updateObj)
      .then(function(node) {
      $scope.showEditor($index, field, false, idPrefix);
      $scope.renderedNodes[$index][field] = newProperty;
      var capitalizedField = field.substr(0, 1).toUpperCase() + field.substr(1);
      $scope['current' + capitalizedField] = newProperty;
      if( field === 'resourceURL' ){
        $scope.currentLinks[0] = newProperty;
      }
    })
      .catch(function(){
        console.log('problem updating node', err);
      });
  };

  $scope.showTitleEditor = function (boolean){
    if( !$scope.isAuthor ){
      $scope.hideTitle = false;
    } else {
      $scope.hideTitle = boolean;
      return $scope.hideTitle;
    }
  };

  $scope.saveTitleEdit = function (){
    var newProperty = $('#main-title').val();
    var updateObj = {};
    updateObj['_id'] = roadmapId;
    updateObj['title'] = newProperty;
    Server.updateRoadmap(updateObj)
      .then(function(node) {
      $scope.hideTitle = false;
      $scope.roadMapTitle = newProperty;
    })
      .catch(function(){
        console.log('problem updating map title', err);
      });
  }

  $scope.showDescEditor = function (boolean){
    if( !$scope.isAuthor ){
      $scope.hideDesc= false;
    } else {
      $scope.hideDesc = boolean;
      return $scope.hideDesc;
    }
  };

  $scope.saveDescEdit = function (){
    Server.updateRoadmap({ _id : roadmapId, description: $('#main-desc').val()})
      .then(function(node) {
      $scope.hideDesc = false;
      $scope.roadMapDesc = $('#main-desc').val();
    })
      .catch(function(){
        console.log('problem updating map description', err);
      });
  }

 // Get the current number of upvotes from current map

 // Renders the nodes for the current roadmap to the page
  $scope.renderNodes = function(){
    var title = $scope.currentRoadMapData.title || 'test title';
    var nodes = $scope.currentRoadMapData.nodes || ['testnode1', 'testnode2'];  
    var desc =  $scope.currentRoadMapData.description || 'default roadmap description - click to edit!';
    // Add an index to nodes to make ng-clicking easier
    nodes.map(function(node,index){
      node.index = index;
    });

    $scope.renderedNodes = nodes;
    $scope.roadMapTitle = title;
    $scope.roadMapDesc = desc;
    $scope.currentNode = nodes[0];
    $scope.currentTitle = $scope.renderedNodes[0].title;
    $scope.currentLinks = [$scope.renderedNodes[0].resourceURL];
    $scope.currentDescription = $scope.renderedNodes[0].description;
  };

  // When roadmap (identified by its id) data is fetched, set it
  function populateData (stop){
    // conditional populateData call can't be called more than once
    stop = stop || false;
    Server.getRoadmapById(roadmapId).then(function (res){
      if( !res.nodes.length && stop === false){
        populateData(true);
      }
      $scope.currentRoadMapData = res;
      console.log($scope.currentRoadMapData,'I am the roadmap');
    }, function(err){
      if (err) return console.log(err);
    })
    .then(function(){
      $scope.renderNodes();
      $scope.renderedComments = RoadmapsFactory.renderComments($scope.currentRoadMapData.comments);
      // Set the upvotes and downvotes
      $scope.upVoteCount = RoadmapsFactory.getCountVotes($scope.currentRoadMapData.upvotes);
      $scope.downVoteCount = RoadmapsFactory.getCountVotes($scope.currentRoadMapData.downvotes);

      // append Editor Mode message
      username = localStorage.getItem('user.username');
      roadmapAuthor = $scope.currentRoadMapData.author.username;
      $scope.isAuthor = username === roadmapAuthor;
        
      if( !$scope.isAuthor ){
        $('#editor-placeholder').append(RoadmapsFactory.editorMsgHTML);
      }
    });
  }

  populateData();

  $scope.selectNode = function($index) {
    $scope.currentIndex = $index;
    $scope.currentTitle = $scope.renderedNodes[$index].title;
    $scope.currentLinks = $scope.renderedNodes[$index].resourceURL;
    $scope.currentResourceURL = $scope.currentLinks[0];
    $scope.currentDescription = $scope.renderedNodes[$index].description;
    $scope.currentNode = $scope.renderedNodes[$index];
    $scope.currentImageUrl = $scope.renderedNodes[$index].imageUrl;
  };

  $scope.submitCompletedNode = function() {
    var nodeId = $scope.currentNode._id;
    User.completeNodeById(nodeId);
    Materialize.toast('Node Complete!', 4000, 'orangeToast');
  }

  $scope.submitCompletedRoadmap = function() {
    Materialize.toast('Map Complete!', 4000, 'orangeToast');
    User.completeRoadmapById(roadmapId);
    $state.go('home.dashboard', {type: 'completed'});
  }

  $scope.upVoteMap = function () {
    User.upvoteMapById(roadmapId)
    .then(function(data){ 
      $scope.upVoteCount = RoadmapsFactory.getCountVotes();
      $scope.downVoteCount = RoadmapsFactory.getCountVotes(data.downvotes);
    })
  }

  $scope.downVoteMap = function () {
    User.downvoteMapById(roadmapId)
    .then(function(data){
      $scope.upVoteCount = RoadmapsFactory.getCountVotes(data.upvotes);
      $scope.downVoteCount = RoadmapsFactory.getCountVotes(data.downvotes);
    });
  };

  $scope.subject = '';
  $scope.content = '';

  $scope.postComment = function(){
    // Will probably need to refactor
    $scope.currentRoadMapData.comments = $scope.currentRoadMapData.comments || [];
    Server.createComment({
      subject: $scope.subject,
      content: $scope.content,
      roadmap: $scope.currentRoadMapData._id
    });
  };

  $(document).ready(function(){
     $('.collapsible').collapsible({
       accordion : true // A setting that changes the collapsible behavior to expandable instead of the default accordion style
     });
   });

  // utility functions
  function resetCreationForm () {
    $scope.urlToScrape = "Paste a link here to get info automatically";
    $scope.currentCreationTitle = RoadmapsFactory.NODE_DEFAULTS.title;
    $scope.currentCreationDescription = RoadmapsFactory.NODE_DEFAULTS.description;
    $scope.currentCreationType = RoadmapsFactory.NODE_DEFAULTS.resourceType;
    $scope.currentCreationLink = RoadmapsFactory.NODE_DEFAULTS.resourceURL;
    $scope.currentCreationImage = 'New node image (optional)';
  }

}]);
