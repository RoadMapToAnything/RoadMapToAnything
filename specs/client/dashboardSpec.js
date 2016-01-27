describe('DashboardController', function () {
  var $scope, $rootScope, $location, createController, $httpBackend;

  beforeEach(module('app'));
  beforeEach(inject(function($injector) {

    // mock out our dependencies
    $rootScope = $injector.get('$rootScope');
    $httpBackend = $injector.get('$httpBackend');
    $location = $injector.get('$location');

    $scope = $rootScope.$new();

    var $controller = $injector.get('$controller');

    createController = function () {
      return $controller('DashboardController', {
        $scope: $scope
      });
    };

    createController();
  }));

//skipping these tests until dashboard api calls decided on

//test followed maps
  it('should have a showMyMaps function', function () {
    expect($scope.showMyMaps).to.be.a('function');
  });

  it('should calculate total nodes for followed (embarked) maps', function (){
    var testMaps = [{nodes:[1,2]}];
    $scope.addTotalNodesOfFollowedMaps(testMaps);
    expect(testMaps[0].totalNodes).to.equal(2);
  });

  it('should calculate total nodes for user-created maps', function (){
    var testMaps = [{nodes:[1,2,3]}];
    $scope.addTotalNodesOfMyMaps(testMaps);
    expect(testMaps[0].totalNodes).to.equal(3);
  });

  xit('should get followed map data with the right properties', function () {
    return $scope.getFollowedMaps()
      .then(function(){
        return $scope.followedMaps[0].title;
      });
  });
//test maps user made
  xit('should have a getMyMaps function', function () {
    expect($scope.getMyMaps).to.be.a('function');
  });

  xit('should get followed map data', function (){
    return $scope.getFollowedMaps()
      .then(function(){
        return Array.isArray($scope.followedMaps).should.be(true);
      });
  });

  xit('should get followed map data with the right properties', function () {
    return $scope.getFollowedMaps()
      .then(function(){
        return typeof $scope.followedMaps[0].title === 'string';
      });
  });

  it('should get hide the myMaps table', function () {
    expect($scope.hideMyMaps).to.be.true;
    });

});
