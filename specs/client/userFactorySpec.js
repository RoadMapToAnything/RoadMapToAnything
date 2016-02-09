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


  /* * * * * * * * * * * * * * * * * * * * * 
   *             AUTHENTICATION            *
   * * * * * * * * * * * * * * * * * * * * */

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
      $httpBackend.expectPOST('/api/signup', data).respond({data: data});
      User.signup(data);
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


  /* * * * * * * * * * * * * * * * * * * * * 
   *              USER DATA                *
   * * * * * * * * * * * * * * * * * * * * */

  describe('User Data Methods', function() {
    var testId = '0000010';
    var data = {
      username: 'user',
      firstName: 'Guy',
      inProgress: {
        roadmaps: [{
          _id: testId,
          nodes: [1, 2, 3]
        }],
        nodes: [{
          _id: '0000100',
          parentRoadmap: testId
        }]
      }
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

    it('Should use the username token to send a get request', function() {
      var response;
      $httpBackend.expectGET('/api/users/' + data.username).respond({data: data});
      User.getData().then(function (res) {
        response = res;
      });
      $httpBackend.flush();
      expect(response).to.deep.equal(data);
    });

    it('Should have follow roadmap methods', function() {
      expect(User.followRoadmapById).to.be.a('function');
      expect(User.followMapById).to.be.a('function');
      expect(User.followRoadmap).to.be.a('function');
      expect(User.followMap).to.be.a('function');
      expect(User.follow).to.be.a('function');
    });

    it('Should send a request to follow roadmap', function() {
      var response;
      $httpBackend.expectPUT('/api/roadmaps/' + testId + '/follow').respond({data: data});
      User.followRoadmapById(testId).then(function (res) {
        response = res;
      });
      $httpBackend.flush();
      expect(response).to.deep.equal(data);
    });

    it('Should have unfollow roadmap methods', function() {
      expect(User.unfollowRoadmapById).to.be.a('function');
      expect(User.unfollowMapById).to.be.a('function');
      expect(User.unfollowRoadmap).to.be.a('function');
      expect(User.unfollowMap).to.be.a('function');
      expect(User.unfollow).to.be.a('function');
    });

    it('Should send a request to unfollow roadmap', function() {
      var response;
      $httpBackend.expectPUT('/api/roadmaps/' + testId + '/unfollow').respond({data: data});
      User.unfollowRoadmapById(testId).then(function (res) {
        response = res;
      });
      $httpBackend.flush();
      expect(response).to.deep.equal(data);
    });

    it('Should have complete node methods', function() {
      expect(User.completeNodeById).to.be.a('function');
      expect(User.completeNode).to.be.a('function');
    });

    it('Should send a request to complete node', function() {
      var response;
      $httpBackend.expectPUT('/api/nodes/' + testId + '/complete').respond({data: data});
      User.completeNodeById(testId).then(function (res) {
        response = res;
      });
      $httpBackend.flush();
      expect(response).to.deep.equal(data);
    });

    it('Should have complete roadmap methods', function() {
      expect(User.completeRoadmapById).to.be.a('function');
      expect(User.completeMapById).to.be.a('function');
      expect(User.completeRoadmap).to.be.a('function');
      expect(User.completeMap).to.be.a('function');
    });

    it('Should send a request to complete roadmap', function() {
      var response;
      $httpBackend.expectPUT('/api/roadmaps/' + testId + '/complete').respond({data: data});
      User.completeRoadmapById(testId).then(function (res) {
        response = res;
      });
      $httpBackend.flush();
      expect(response).to.deep.equal(data);
    });

    it('Should have upvote roadmap methods', function() {
      expect(User.upvoteRoadmapById).to.be.a('function');
      expect(User.upvoteMapById).to.be.a('function');
      expect(User.upvoteRoadmap).to.be.a('function');
      expect(User.upvoteMap).to.be.a('function');
      expect(User.upvote).to.be.a('function');
    });

    it('Should send a request to upvote roadmap', function() {
      var response;
      $httpBackend.expectPUT('/api/roadmaps/' + testId + '/upvote').respond({data: data});
      User.upvoteRoadmapById(testId).then(function (res) {
        response = res;
      });
      $httpBackend.flush();
      expect(response).to.deep.equal(data);
    });

    it('Should have downvote roadmap methods', function() {
      expect(User.downvoteRoadmapById).to.be.a('function');
      expect(User.downvoteMapById).to.be.a('function');
      expect(User.downvoteRoadmap).to.be.a('function');
      expect(User.downvoteMap).to.be.a('function');
      expect(User.downvote).to.be.a('function');
    });

    it('Should send a request to downvote roadmap', function() {
      var response;
      $httpBackend.expectPUT('/api/roadmaps/' + testId + '/downvote').respond({data: data});
      User.downvoteRoadmapById(testId).then(function (res) {
        response = res;
      });
      $httpBackend.flush();
      expect(response).to.deep.equal(data);
    });

    it('Should have progress methods', function() {
      expect(User.getRoadmapProgress).to.be.a('function');
      expect(User.getMapProgress).to.be.a('function');
      expect(User.getProgress).to.be.a('function');
    });

    xit('Should send a request if getting progress with no local data', function() {
      var response;
      $httpBackend.expectGET('/api/users/' + data.username).respond({data: data});
      User.getRoadmapProgress().then(function (res) {
        response = res;
      });
      $httpBackend.flush();

      expect(response).to.be.an('array');
      expect(response[0]).to.deep.equal({_id: '0000010', completed: 1, total: 3, percent: 33});
    });

    xit('Should send not send a request if getting progress with local data', function() {
      var response = User.getRoadmapProgress(data);

      expect(response).to.be.an('array');
      expect(response[0]).to.deep.equal({_id: '0000010', completed: 1, total: 3, percent: 33});
    });

  });
});
