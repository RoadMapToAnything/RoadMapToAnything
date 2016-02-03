// TODO: Turn the following into a real test

describe('Server Factory', function () {
  var $scope, $rootScope, $location, $window, $httpBackend, createController, Server;
  var username = 'user';
  var token = 'sjj232hwjhr3urw90rof';

  // using angular mocks, we can inject the injector
  // to retrieve our dependencies
  beforeEach(module('services.server'));
  beforeEach(inject(function($injector) {

    // mock out our dependencies
    $rootScope = $injector.get('$rootScope');
    $location = $injector.get('$location');
    $window = $injector.get('$window');
    $httpBackend = $injector.get('$httpBackend');
    Server = $injector.get('Server');
    $scope = $rootScope.$new();
    $window.localStorage.setItem('user.authToken', token);
    $window.localStorage.setItem('user.username', username);
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
    $window.localStorage.removeItem('user.authToken');
    $window.localStorage.removeItem('user.username');
  });


  /* * * * * * * * * * * * * * * * * * * * * 
   *             USERS METHODS             *
   * * * * * * * * * * * * * * * * * * * * */

  describe('Users Methods', function() {
    var testId = '0000000010';
    var data = {
      _id: testId,
      username: username,
      firstName: 'Gal',
      authoredRoadmaps:[testId]
    };

    it('Should have a getUsers method', function() {
      expect(Server.getUsers).to.be.a('function');
    });

    it('Should send the proper GET request', function() {
      var response;
      $httpBackend.expectGET('/api/users').respond({data: data});
      Server.getUsers().then(function (res) {
        response = res;
      });
      $httpBackend.flush();
      expect(response).to.deep.equal(data);
    });

    it('Should have a getUsers method', function() {
      expect(Server.getUserByUsername).to.be.a('function');
      expect(Server.getUser).to.be.a('function');
    });

    it('Should send a GET request for the proper user', function() {
      var response;
      $httpBackend.expectGET('/api/users/' + data.username).respond({data: data});
      Server.getUserByUsername(data.username).then(function (res) {
        response = res;
      });
      $httpBackend.flush();
      expect(response).to.deep.equal(data);
    });

    it('Should have a updateUser method', function() {
      expect(Server.updateUser).to.be.a('function');
    });

    it('Should send a PUT request for the proper user with the right data', function() {
      var response;
      $httpBackend.expectPUT('/api/users/' + data.username, data).respond({data: data});
      Server.updateUser(data).then(function (res) {
        response = res;
      });
      $httpBackend.flush();
      expect(response).to.deep.equal(data);
    });

    it('Should have a deleteUser method', function() {
      expect(Server.deleteUserByUsername).to.be.a('function');
      expect(Server.deleteUser).to.be.a('function');
    });

    it('Should send a DELETE request for the proper user', function() {
      var response;
      $httpBackend.expectDELETE('/api/users/' + data.username).respond({data: data});
      Server.deleteUserByUsername(data.username).then(function (res) {
        response = res;
      });
      $httpBackend.flush();
      expect(response).to.deep.equal(data);
    });


  /* * * * * * * * * * * * * * * * * * * * * 
   *           ROADMAPS METHODS            *
   * * * * * * * * * * * * * * * * * * * * */

    it('Should have a getRoadmaps method', function() {
      expect(Server.getRoadmaps).to.be.a('function');
      expect(Server.getMaps).to.be.a('function');
    });

    it('Should send a GET request for roadmaps', function() {
      var response;
      $httpBackend.expectGET('/api/roadmaps').respond({data: data});
      Server.getRoadmaps().then(function (res) {
        response = res;
      });
      $httpBackend.flush();
      expect(response).to.deep.equal(data);
    });

    it('Should have a getRoadmaps method', function() {
      expect(Server.getRoadmapById).to.be.a('function');
      expect(Server.getMapById).to.be.a('function');
      expect(Server.getRoadmap).to.be.a('function');
      expect(Server.getMap).to.be.a('function');
    });

    it('Should send a GET request for the proper roadmap', function() {
      var response;
      $httpBackend.expectGET('/api/roadmaps/' + testId).respond({data: data});
      Server.getRoadmapById(testId).then(function (res) {
        response = res;
      });
      $httpBackend.flush();
      expect(response).to.deep.equal(data);
    });

    it('Should have an updateRoadmap method', function() {
      expect(Server.updateRoadmap).to.be.a('function');
      expect(Server.updateMap).to.be.a('function');
    });

    it('Should send a PUT request for the proper roadmap, with the right data', function() {
      var response;
      $httpBackend.expectPUT('/api/roadmaps/' + data._id, data).respond({data: data});
      Server.updateRoadmap(data).then(function (res) {
        response = res;
      });
      $httpBackend.flush();
      expect(response).to.deep.equal(data);
    });

    it('Should have delte roadmaps methods', function() {
      expect(Server.deleteRoadmapById).to.be.a('function');
      expect(Server.deleteMapById).to.be.a('function');
      expect(Server.deleteRoadmap).to.be.a('function');
      expect(Server.deleteMap).to.be.a('function');
    });

    it('Should send a DELETE request for the proper roadmap', function() {
      var response;
      $httpBackend.expectDELETE('/api/roadmaps/' + testId).respond({data: data});
      Server.deleteRoadmapById(testId).then(function (res) {
        response = res;
      });
      $httpBackend.flush();
      expect(response).to.deep.equal(data);
    });

  });

});