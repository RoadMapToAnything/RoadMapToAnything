angular.module('roadmaps.ctrl', ['roadmaps.factory', 'services.server', 'services.user', 'scraper.ctrl'])

.controller('RoadMapsController', [ '$scope', '$http', '$stateParams', 'RoadMapsFactory', 'Server', 'User', '$timeout', '$state', function($scope, $http, $stateParams, RoadMapsFactory, Server, User, $timeout, $state){  
  angular.extend($scope, RoadMapsFactory);

  var NODE_DEFAULTS = {
    title: 'New node title',
    description: 'New node description',
    resourceType: 'New node type',
    resourceURL: 'New node link (optional)',
    imageUrl: 'https://openclipart.org/image/2400px/svg_to_png/103885/SimpleStar.png'
  }

  var roadmapId = $stateParams.roadmapID;
  $scope.currentRoadMapData = {};
  $scope.renderedNodes = [];
  $('.tooltipped').tooltip({delay: 50});

  $scope.showComments = false;
  $scope.currentIndex = 0;

  $scope.toggleComments = function(){
    $scope.showComments = true;
  };

  $scope.isAuthor = function (){
    var username = localStorage.getItem('user.username');
    var roadmapAuthor = $scope.currentRoadMapData.author.username;
    if (username === roadmapAuthor){
      return true;
    } else {
      return false;
    }
  };

  $scope.resetCreationForm = function() {
    $scope.urlToScrape = "Paste a link here to get info automatically";
    $scope.currentCreationTitle = NODE_DEFAULTS.title;
    $scope.currentCreationDescription = NODE_DEFAULTS.description;
    $scope.currentCreationType = NODE_DEFAULTS.resourceType;
    $scope.currentCreationLink = NODE_DEFAULTS.resourceURL;
    $scope.currentCreationImage = 'New node image (optional)';
  }

  $scope.resetCreationForm();

  $scope.displayUrl = '';
  $scope.scrape = {};

  $scope.checkAndSubmit = function() {
    var url = $scope.urlToScrape;
    if (url.length < 4) return;
    if (url.substring(0, 4) !== 'http') url = 'http://' + url;

    $scope.displayUrl = url;
    console.log("scraping url", url);
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
    console.log("SHOWNODECRETAOR $index:", $index);
    $scope.currentAddIndex = $index + 1;
    var username = localStorage.getItem('user.username');
    var roadmapAuthor = $scope.currentRoadMapData.author.username;
    console.log("'mini-circle-' + $index", 'mini-circle-' + $index);
    $scope.currentAddIndex = $index;
    if( username !== roadmapAuthor ){
      $scope.nodeCreator = false;
      console.log("author fail");
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
      parentRoadmap: roadmapId

    })
    .then(function(res){
      populateData();
      console.log("node created");
      $scope.displayNodeCreator = false;
      Materialize.toast('Node Added!', 4000, 'orangeToast');
      $scope.resetCreationForm();
    });
  };

  $scope.closeNodeCreator = function(){
    $scope.displayNodeCreator = false;
    $scope.resetCreationForm();
  }

  $scope.hideText = function ($index, field, idPrefix){
    $index = $index || 0;
    var elementID = '#' + idPrefix + '-' + field + '-' + $index;
    var username = localStorage.getItem('user.username');
    var roadmapAuthor = $scope.currentRoadMapData.author.username;
    if( username !== roadmapAuthor ){
      return false;
    } else {
      if( !$scope[elementID] ){
        return  false;
      } else {
        return true;
      }
    }
  };

  $scope.showEditor = function ($index, field, boolean, idPrefix){
    var elementID = '#' + idPrefix + '-' + field + '-' + $index;
    $scope.currentIndex = $index;
    var username = localStorage.getItem('user.username');
    var roadmapAuthor = $scope.currentRoadMapData.author.username;
    
    if( username !== roadmapAuthor ){
      $scope[elementID] = false;
      console.log("author fail");
    } else {
      if( field === 'circle' && idPrefix === 'mini'){
        $scope.resetCreationForm();
      }
      if( !$scope.currentResourceURL ) {
        $scope.currentResourceURL = $scope.currentLinks[0];
      }

      if(boolean === false && field !== 'circle'){
        $(elementID).val($scope.renderedNodes[$index][field]);
      }
      console.log("SHOW EDITOR");
      console.log('elementID', elementID);
      console.log('$scope[elementID]', $scope[elementID]);
      $scope[elementID] = boolean;
    }


  };

  $scope.getPlaceholder = function($index, field){
    var capitalizedField = field.substr(0, 1).toUpperCase() + field.substr(1);
    return $scope['current' + capitalizedField];
  };

  $scope.saveEdit = function($index, field, idPrefix){
    var elementID = '#' + idPrefix + '-' + field + '-' + $index;
    var newProperty = $(elementID).val();
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

  //roadMapTitle

  $scope.hideTitle = false;
  $scope.hideDesc = false;

  $scope.showTitleEditor = function (boolean){
    var username = localStorage.getItem('user.username');
    var roadmapAuthor = $scope.currentRoadMapData.author.username;
    var storedTitle;
    
    if( username !== roadmapAuthor ){
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
    var username = localStorage.getItem('user.username');
    var roadmapAuthor = $scope.currentRoadMapData.author.username;
    var storedDesc;
    
    if( username !== roadmapAuthor ){
      $scope.hideDesc= false;
    } else {
      $scope.hideDesc = boolean;
      return $scope.hideDesc;
    }

  };

  $scope.saveDescEdit = function (){
    console.log('clicked saveDescEdit');
    var newProperty = $('#main-desc').val();
    var updateObj = {};
    updateObj['_id'] = roadmapId;
    updateObj['description'] = newProperty;
    console.log('new desc', newProperty);
    Server.updateRoadmap(updateObj)
      .then(function(node) {
      $scope.hideDesc = false;
      $scope.roadMapDesc = newProperty;
    })
      .catch(function(){
        console.log('problem updating map description', err);
      });
  }

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
    var desc =  $scope.currentRoadMapData.description || 'default roadmap description - click to edit!';
    // Add an index to nodes to make ng-clicking easier
    nodes.map(function(node,index){
      node.index = index;
    });

    $scope.renderedNodes = nodes;
    $scope.roadMapTitle = title;
    $scope.roadMapDesc = desc;

    // User Logged in Data in the future
    // Some variable that holds that the user is logged in
    $scope.currentNode = nodes[0];
    $scope.renderCurrentNode();
  };
  // Make a $scope.renderComments()
  $scope.renderComments = function(){
    var comments = $scope.currentRoadMapData.comments;
    console.log(comments);
    comments.map(function(comment,index){
      comment.index = index;
    })
    $scope.renderedComments = comments;
  }


  // When roadmap (identified by its id) data is fetched, set it
  function populateData (stop){
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
      $scope.renderComments();
      // Set the upvotes and downvotes
      var currentMapUpVotes = $scope.currentRoadMapData.upvotes;
      var currentMapDownVotes = $scope.currentRoadMapData.downvotes;
      $scope.upVoteCount = $scope.getCountVotes(currentMapUpVotes);
      $scope.downVoteCount = $scope.getCountVotes(currentMapDownVotes);

      // append Editor Mode message
      var username = localStorage.getItem('user.username');
      var roadmapAuthor = $scope.currentRoadMapData.author.username;
        
      if( username === roadmapAuthor ){
        $('#editor-placeholder').append(
        '<div ng-hide="notAuthor()" class="editor-msg row blue lighten-4">' +
          '<div class="col s0 m1 l1">' +
            '<i class="fa fa-pencil fa-lg"></i>' +
          '</div>' +
          '<div class="col s0 m10 l10">' +
              'Since you created this roadmap, you can add or edit properties by clicking on them.' +
          '</div>' +
          '<div class="col s0 m1 l1">' +
            '<i class="fa fa-pencil fa-lg"></i>' +
          '</div>' +
        '</div>'
        );
      }
    });
  }

  populateData();

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
    $scope.currentDescription = description;
  }

  $scope.selectNode = function($index) {

    var links = $scope.renderedNodes[$index].resourceURL;
    var description = $scope.renderedNodes[$index].description;
    var title = $scope.renderedNodes[$index].title;

    $scope.currentIndex = $index;
    $scope.currentTitle = title;
    $scope.currentLinks = links;
    $scope.currentResourceURL = $scope.currentLinks[0];
    $scope.currentDescription = description;
    $scope.currentNode = $scope.renderedNodes[$index];
    
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
    });
  };

  $scope.connectLines = function(){
    $('.endPointForConnection').connections();
  };

  // We need async because ng-repeat creates the nodes before this function runs set timeout changes the loop.
  $scope.asyncConnectLines = function(cb){
    setTimeout($scope.connectLines,0);
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

}]);
