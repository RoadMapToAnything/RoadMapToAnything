// TODO: Refactor the following into a real test

describe('User Factory', function () {
  var $scope, $rootScope, $location, $window, $httpBackend, User;

  // using angular mocks, we can inject the injector
  // to retrieve our dependencies
  beforeEach(module('services.user'));
  beforeEach(inject(function($injector) {

    // mock out our dependencies
    $rootScope = $injector.get('$rootScope');
    $location = $injector.get('$location');
    $window = $injector.get('$window');
    $httpBackend = $injector.get('$httpBackend');
    User = $injector.get('User');
    $scope = $rootScope.$new();
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
    $window.localStorage.removeItem('user.authToken');
  });

  describe('Authorization', function() {
    var data = {
      username: 'test',
      authToken: 'sjj232hwjhr3urw90rof'
    };

    it('should have a signup method', function() {
      expect(User.signup).to.be.a('function');
    });

    it('should store token in localStorage after signup', function() {
      // create a fake JWT for auth


      // make a 'fake' reques to the server, not really going to our server
      $httpBackend.expectPOST('/api/signup').respond({data: data});
      User.signup();
      $httpBackend.flush();
      console.log('TOKEN:', $window.localStorage.getItem('user.authToken'));
      expect($window.localStorage.getItem('user.authToken')).to.equal(data.authToken);
    });

    it('should have a signin method', function() {
      expect(User.login).to.be.a('function');
    });

    it('should store token in localStorage after signin', function() {
      // create a fake JWT for auth
      $httpBackend.expectGET('/api/login').respond({data: data});
      User.login();
      $httpBackend.flush();
      expect($window.localStorage.getItem('user.authToken')).to.equal(data.authToken);
    });
  });
});

/*

  var mapId = '000000000000000000000010';
  var nodeId = '000000000000000000000100';

  User.followRoadmapById(mapId)
  .then(function (user) {
    console.log('Progress on one', User.getRoadmapProgress(user, mapId) );

    return User.completeNodeById(nodeId)
  })

  .then(function (user) {
    console.log('Progress on all', User.getRoadmapProgress(user) );

    return User.getProgress();
  })

  .then(function (progress) {
    console.log('Async Progress', progress);

    return User.getData();
  })

  .then(function (user) {
    console.log('User data', user);

    User.followRoadmap(mapId);
    User.followMap(mapId);
    User.follow(mapId);

    User.unfollowRoadmapById(mapId);
    User.unfollowRoadmap(mapId);
    User.unfollowMap(mapId);
    User.unfollow(mapId);

    User.completeNode(nodeId);

    User.completeRoadmapById(mapId);
    User.completeRoadmap(mapId);
    return User.completeMap(mapId);
  })

  .then(function (user) {
    console.log('User at end', user);
  });

*/