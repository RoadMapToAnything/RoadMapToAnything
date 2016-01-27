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


//test followed maps
  it('should have functions for getting myMaps data', function () {
    expect($scope.showMyMaps).to.be.a('function');
    expect($scope.getMyMaps).to.be.a('function');
  });

  it('should have functions for getting followedMaps data', function () {
    expect($scope.showFollowed).to.be.a('function');
    expect($scope.getFollowedMaps).to.be.a('function');
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

  it('should get hide the myMaps table', function () {
    expect($scope.hideMyMaps).to.be.true;
    });

});
