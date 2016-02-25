angular.module('roadmaps.ctrl', ['roadmaps.factory', 'services.server', 'services.user', 'scraper.ctrl'])

.controller('RoadMapsController', [ '$scope', '$http', '$stateParams', 'RoadmapsFactory', 'Server', 'User', '$timeout', '$state', function($scope, $http, $stateParams, RoadmapsFactory, Server, User, $timeout, $state){  
  angular.extend($scope, RoadmapsFactory);

  $('.tooltipped').tooltip({delay: 50});

  $scope.roadmap = {
    _id: $stateParams.roadmapID
  };
  $scope.newNode = {};
  $scope.isAuthor = false;
  $scope.showComments = false;
  $scope.currentIndex = 0;
  $scope.hideTitle = false;
  $scope.hideDesc = false;

  populateData();

  resetCreationForm();

  function populateData (stop){
    // conditional populateData call can't be called more than once
    stop = stop || false;
    Server.getRoadmapById($scope.roadmap._id).then(function (res){
      if( !res.nodes.length && stop === false){
        populateData(true);
      }
      $scope.roadmap = res;
    }, function(err){
      if (err) return console.log(err);
    })
    .then(function(){
      $scope.renderNodes();
      $scope.roadmap.comments = RoadmapsFactory.renderComments($scope.roadmap.comments);
      $scope.roadmap.upvotes = RoadmapsFactory.getCountVotes($scope.roadmap.upvotes);
      $scope.roadmap.downvotes = RoadmapsFactory.getCountVotes($scope.roadmap.downvotes);

      // append Editor Mode message
      username = localStorage.getItem('user.username');
      roadmapAuthor = $scope.roadmap.author.username;
      $scope.isAuthor = username === roadmapAuthor;
        
      if( !$scope.isAuthor  && $('#editor-placeholder').length === 0 ){
        $('#editor-placeholder').append(RoadmapsFactory.editorMsgHTML);
      }
    });
  }

  $scope.checkAndSubmit = function() {
    var url = $scope.urlToScrape;
    if (url.length < 4) return;
    if (url.substring(0, 4) !== 'http') url = 'http://' + url;

    Server.scrape(url)
    .then(function (data) {
        $scope.newNode.title = data.title;
        $scope.newNode.description = data.description;
        $scope.newNode.type = data.type;
        $scope.newNode.resourceURL = url;
        $scope.newNode.imageUrl = data.imageUrl;
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
    console.log($scope.newNode.imageUrl);
    if( $scope.newNode.imageUrl === 'New node image (optional)' ){
      $scope.newNode.imageUrl = NODE_DEFAULTS.imageUrl;
    }

    return Server.createNode({
      title: $scope.newNode.title || NODE_DEFAULTS.title,
      description: $scope.newNode.description || NODE_DEFAULTS.description,
      resourceType: $scope.newNode.type || NODE_DEFAULTS.resourceType,
      resourceURL: $scope.newNode.resourceURL || NODE_DEFAULTS.resourceURL,
      imageUrl: $scope.newNode.imageUrl || NODE_DEFAULTS.imageUrl,
      parentRoadmap: $scope.roadmap._id,
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
        console.log('$scope[' + elementID + ']', false);
        return  false;
      } else {
        console.log('$scope[' + elementID + ']', true);
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
        $(elementID).val($scope.nodes[$index][type]);
      }

      $scope[elementID] = boolean;
    }


  };

  $scope.getPlaceholder = function($index, field){
    var capitalizedField = field.substr(0, 1).toUpperCase() + field.substr(1);
    return $scope['current' + capitalizedField];
  };

  $scope.saveEdit = function($index, field, idPrefix){
  //  console.log('** $index', $index);
  //  console.log('** idPrefix', idPrefix);
    var elementID = '#' + idPrefix + $index;
    console.log('** elementID', elementID);
    var selectedInput = $(elementID);
    console.log('jQuery obj', selectedInput);
    console.log('jQuery val', selectedInput.val());
    var newProperty = $(elementID).val();
    console.log('newProperty', newProperty);
    var updateObj = {};
    updateObj['_id'] = $scope.nodes[$index]._id;
    updateObj[field] = newProperty;
    Server.updateNode(updateObj)
      .then(function(node) {
      $scope.showEditor($index, field, false, idPrefix);
      $scope.nodes[$index][field] = newProperty;
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
    var newProperty = $('#map-title').val();
    var updateObj = {};
    updateObj['_id'] = $scope.roadmap._id;
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
    Server.updateRoadmap({ _id : $scope.roadmap._id, description: $('#main-desc').val()})
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
    var title = $scope.roadmap.title || 'test title';
    var nodes = $scope.roadmap.nodes || ['testnode1', 'testnode2'];  
    var desc =  $scope.roadmap.description || 'default roadmap description - click to edit!';
    // Add an index to nodes to make ng-clicking easier
    nodes.map(function(node,index){
      node.index = index;
    });

    $scope.nodes = nodes;
    $scope.roadMapTitle = title;
    $scope.roadMapDesc = desc;
    $scope.currentNode = nodes[0];
    $scope.currentTitle = $scope.nodes[0].title;
    $scope.currentLinks = [$scope.nodes[0].resourceURL];
    $scope.currentDescription = $scope.nodes[0].description;
  };



  $scope.selectNode = function($index) {
    $scope.currentIndex = $index;
    $scope.currentTitle = $scope.nodes[$index].title;
    $scope.currentLinks = $scope.nodes[$index].resourceURL;
    $scope.currentResourceURL = $scope.currentLinks[0];
    $scope.currentDescription = $scope.nodes[$index].description;
    $scope.currentNode = $scope.nodes[$index];
    $scope.currentImageUrl = $scope.nodes[$index].imageUrl;
  };

  $scope.submitCompletedNode = function() {
    var nodeId = $scope.currentNode._id;
    User.completeNodeById(nodeId);
    Materialize.toast('Node Complete!', 4000, 'orangeToast');
  }

  $scope.submitCompletedRoadmap = function() {
    Materialize.toast('Map Complete!', 4000, 'orangeToast');
    User.completeRoadmapById($scope.roadmap._id);
    $state.go('home.dashboard', {type: 'completed'});
  }

  $scope.upVoteMap = function () {
    User.upvoteMapById($scope.roadmap._id)
    .then(function(data){ 
      $scope.roadmap.upvotes = RoadmapsFactory.getCountVotes();
      $scope.roadmap.downvotes = RoadmapsFactory.getCountVotes(data.downvotes);
    })
  }

  $scope.downVoteMap = function () {
    User.downvoteMapById($scope.roadmap._id)
    .then(function(data){
      $scope.roadmap.downvotes = RoadmapsFactory.getCountVotes(data.upvotes);
      $scope.roadmap.downvotes = RoadmapsFactory.getCountVotes(data.downvotes);
    });
  };

  $scope.subject = '';
  $scope.content = '';

  $scope.postComment = function(){
    // Will probably need to refactor
<<<<<<< HEAD
    $scope.currentRoadMapData.comments = $scope.currentRoadMapData.comments || [];
=======
    $scope.roadmap.comments = $scope.roadmap.comments || [];

>>>>>>> (refactor) Move scope vars to roadmap obj
    Server.createComment({
      subject: $scope.subject,
      content: $scope.content,
      roadmap: $scope.roadmap._id
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
    $scope.newNode.title = RoadmapsFactory.NODE_DEFAULTS.title;
    $scope.newNode.description = RoadmapsFactory.NODE_DEFAULTS.description;
    $scope.newNode.type = RoadmapsFactory.NODE_DEFAULTS.resourceType;
    $scope.newNode.resourceURL = RoadmapsFactory.NODE_DEFAULTS.resourceURL;
    $scope.newNode.imageUrl = 'New node image (optional)';
  }
  $scope.toggleComments = function(){
    $scope.showComments = !$scope.showComments;
  };

}]);
