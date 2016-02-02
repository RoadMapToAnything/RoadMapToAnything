// TODO: Turn the following into a real test

// describe('Server Factory', function () {
//   var $scope, $rootScope, $location, $window, $httpBackend, createController, User;

//   // using angular mocks, we can inject the injector
//   // to retrieve our dependencies
//   beforeEach(module('services.user'));
//   beforeEach(inject(function($injector) {

//     // mock out our dependencies
//     $rootScope = $injector.get('$rootScope');
//     $location = $injector.get('$location');
//     $window = $injector.get('$window');
//     $httpBackend = $injector.get('$httpBackend');
//     Server = $injector.get('Server');
//     $scope = $rootScope.$new();
//   }));

//   afterEach(function() {
//     $httpBackend.verifyNoOutstandingExpectation();
//     $httpBackend.verifyNoOutstandingRequest();
//     $window.localStorage.removeItem('user.authToken');
//   });

//   it('should have a signup method', function() {
//     expect(Server.signup).to.be.a('function');
//   });

//   it('should store token in localStorage after signup', function() {
//     // create a fake JWT for auth
//     var token = 'sjj232hwjhr3urw90rof';

//     // make a 'fake' reques to the server, not really going to our server
//     $httpBackend.expectPOST('/api/signup').respond({token: token});
//     Server.signup();
//     $httpBackend.flush();
//     expect($window.localStorage.getItem('user.authToken')).to.be(token);
//   });

//   it('should have a signin method', function() {
//     expect(Server.signin).to.be.a('function');
//   });

//   it('should store token in localStorage after signin', function() {
//     // create a fake JWT for auth
//     var token = 'sjj232hwjhr3urw90rof';
//     $httpBackend.expectPOST('/api/signin').respond({token: token});
//     Server.signin();
//     $httpBackend.flush();
//     expect($window.localStorage.getItem('user.authToken')).to.be(token);
//   });
// });


/*

var username = localStorage.getItem('user.username');

var updateUser = {
  username: username,
  firstName: 'Updated Name'
};

var newMap = {
  title: 'New Roadmap',
  description: 'I am a brand new roadmap!'
};

var newNode = {
  title: 'New Node',
  description: 'I am a brande new node!',
  resourceType: 'A Node'
};


Server.createRoadmap(newMap)
.then(function (map) {
  var mapId = map._id;
  var updateMap = {
    _id: mapId,
    title: 'Updated Title'
  };

  Server.getRoadmaps();
  Server.getMaps();
  Server.getRoadmapById(mapId);
  Server.getRoadmap(mapId);
  Server.getMap(mapId);
  Server.updateRoadmap(updateMap);
  Server.updateMap(updateMap);
  Server.deleteRoadmapById(mapId);
});

Server.createNode(newNode)
.then(function (node) {
  var nodeId = node._id;
  var updateNode = {
    _id: nodeId,
    title: 'Updated Title'
  };

  Server.getNodeById(nodeId);
  Server.getNode(nodeId);
  Server.updateNode(updateNode);

  Server.getUsers();
  Server.getUserByUsername(username);
  Server.getUser(username);
  Server.updateUser(updateUser);

  Server.deleteUserByUsername(username);
  Server.deleteNodeById(nodeId);
});

*/