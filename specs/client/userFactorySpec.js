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
    $window.localStorage.removeItem('user.username');
  });

  describe('Authorization', function() {
    var data = {
      username: 'test',
      authToken: 'sjj232hwjhr3urw90rof'
    };

    it('Should have a signup method', function() {
      expect(User.signup).to.be.a('function');
    });

    it('Should store tokens in localStorage after signup', function() {
      var storage = $window.localStorage;

      // make a 'fake' request to the server, not really going to our server
      $httpBackend.expectPOST('/api/signup').respond({data: data});
      User.signup();
      $httpBackend.flush();
      expect(storage.getItem('user.authToken')).to.equal(data.authToken);
      expect(storage.getItem('user.username')).to.equal(data.username);
    });

    it('Should have a signin method', function() {
      expect(User.login).to.be.a('function');
    });

    it('Should store token in localStorage after signin', function() {
      var storage = $window.localStorage;

      $httpBackend.expectGET('/api/login').respond({data: data});
      User.login();
      $httpBackend.flush();
      expect(storage.getItem('user.authToken')).to.equal(data.authToken);
      expect(storage.getItem('user.username')).to.equal(data.username);
    });

    it('Should have an isLoggedIn method', function() {
      expect(User.isLoggedIn).to.be.a('function');
    });

    it('Should know if the user is logged in', function() {
      var storage = $window.localStorage;
      storage.setItem('user.authToken', data.authToken);
      storage.setItem('user.username', data.username);

      expect(User.isLoggedIn()).to.be.true;
    });

    it('Should have a logout method', function() {
      expect(User.logout).to.be.a('function');
    });

    it('Should remove tokens on logout', function() {
      var storage = $window.localStorage;
      storage.setItem('user.authToken', data.authToken);
      storage.setItem('user.username', data.username);

      User.logout();
      expect(storage.getItem('user.authToken')).to.be.null;
      expect(storage.getItem('user.username')).to.be.null;
    });

  });

  describe('User Data Methods', function() {
    var data = {
      username: 'user',
      firstName: 'Guy'
    };

    beforeEach(function() {
      $window.localStorage.setItem('user.username', data.username);
    });

    afterEach(function() {
      $window.localStorage.removeItem('user.username');
    });

    it('Should have a getData method', function() {
      expect(User.getData).to.be.a('function');
    });

    it('Should store tokens in localStorage after signup', function() {
      $httpBackend.expectGET('/api/users/' + data.username).respond({data: data});
      User.getData();
      $httpBackend.flush();
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