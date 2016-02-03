describe('Server Factory', function () {
  var $scope, $rootScope, $location, $window, $httpBackend, createController, Server;
  var testId = '0000000010';
  var username = 'user';
  var data = {
      _id: testId,
      username: username,
      firstName: 'Gal',
      authoredRoadmaps:[testId]
    };
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

    it('Should have a getUsers method', function() {
      expect(Server.getUsers).to.be.a('function');
    });

    it('Should send the right GET request', function() {
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

    it('Should send a GET request for the right user', function() {
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

    it('Should send a PUT request for the right user with the right data', function() {
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

    it('Should send a DELETE request for the right user', function() {
      var response;
      $httpBackend.expectDELETE('/api/users/' + data.username).respond({data: data});
      Server.deleteUserByUsername(data.username).then(function (res) {
        response = res;
      });
      $httpBackend.flush();
      expect(response).to.deep.equal(data);
    });
  });


  /* * * * * * * * * * * * * * * * * * * * * 
   *           ROADMAPS METHODS            *
   * * * * * * * * * * * * * * * * * * * * */

  describe('Roadmaps Methods', function() {

    it('Should have getRoadmaps methods', function() {
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

    it('Should have get roadmap methods', function() {
      expect(Server.getRoadmapById).to.be.a('function');
      expect(Server.getMapById).to.be.a('function');
      expect(Server.getRoadmap).to.be.a('function');
      expect(Server.getMap).to.be.a('function');
    });

    it('Should send a GET request for the right roadmap', function() {
      var response;
      $httpBackend.expectGET('/api/roadmaps/' + testId).respond({data: data});
      Server.getRoadmapById(testId).then(function (res) {
        response = res;
      });
      $httpBackend.flush();
      expect(response).to.deep.equal(data);
    });

    it('Should have create roadmap methods', function() {
      expect(Server.createRoadmap).to.be.a('function');
      expect(Server.createMap).to.be.a('function');
    });

    it('Should send a POST request with the right data', function() {
      var response;
      $httpBackend.expectPOST('/api/roadmaps', data).respond({data: data});
      Server.createRoadmap(data).then(function (res) {
        response = res;
      });
      $httpBackend.flush();
      expect(response).to.deep.equal(data);
    });

    it('Should have a update roadmap methods', function() {
      expect(Server.updateRoadmap).to.be.a('function');
      expect(Server.updateMap).to.be.a('function');
    });

    it('Should send a PUT request for the right roadmap, with the right data', function() {
      var response;
      $httpBackend.expectPUT('/api/roadmaps/' + data._id, data).respond({data: data});
      Server.updateRoadmap(data).then(function (res) {
        response = res;
      });
      $httpBackend.flush();
      expect(response).to.deep.equal(data);
    });

    it('Should have delete roadmap methods', function() {
      expect(Server.deleteRoadmapById).to.be.a('function');
      expect(Server.deleteMapById).to.be.a('function');
      expect(Server.deleteRoadmap).to.be.a('function');
      expect(Server.deleteMap).to.be.a('function');
    });

    it('Should send a DELETE request for the right roadmap', function() {
      var response;
      $httpBackend.expectDELETE('/api/roadmaps/' + testId).respond({data: data});
      Server.deleteRoadmapById(testId).then(function (res) {
        response = res;
      });
      $httpBackend.flush();
      expect(response).to.deep.equal(data);
    });
  });


  /* * * * * * * * * * * * * * * * * * * * * 
   *             NODES METHODS             *
   * * * * * * * * * * * * * * * * * * * * */

  describe('Nodes Methods', function() {

    it('Should have get node methods', function() {
      expect(Server.getNodeById).to.be.a('function');
      expect(Server.getNode).to.be.a('function');
    });

    it('Should send a GET request for the right node', function() {
      var response;
      $httpBackend.expectGET('/api/nodes/' + testId).respond({data: data});
      Server.getNodeById(testId).then(function (res) {
        response = res;
      });
      $httpBackend.flush();
      expect(response).to.deep.equal(data);
    });

    it('Should have a create node method', function() {
      expect(Server.createNode).to.be.a('function');
    });

    it('Should send a POST request with the right data', function() {
      var response;
      $httpBackend.expectPOST('/api/nodes', data).respond({data: data});
      Server.createNode(data).then(function (res) {
        response = res;
      });
      $httpBackend.flush();
      expect(response).to.deep.equal(data);
    });

    it('Should have an update node method', function() {
      expect(Server.updateNode).to.be.a('function');
    });

    it('Should send a PUT request for the right node with the right data', function() {
      var response;
      $httpBackend.expectPUT('/api/nodes/' + data._id, data).respond({data: data});
      Server.updateNode(data).then(function (res) {
        response = res;
      });
      $httpBackend.flush();
      expect(response).to.deep.equal(data);
    });

    it('Should have delete node method', function() {
      expect(Server.deleteNodeById).to.be.a('function');
      expect(Server.deleteNode).to.be.a('function');
    });

    it('Should send a DELETE request for the right node', function() {
      var response;
      $httpBackend.expectDELETE('/api/nodes/' + testId).respond({data: data});
      Server.deleteNodeById(testId).then(function (res) {
        response = res;
      });
      $httpBackend.flush();
      expect(response).to.deep.equal(data);
    });

  });

});
