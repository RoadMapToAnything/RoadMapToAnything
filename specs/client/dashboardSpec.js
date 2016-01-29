describe('DashboardController', function () {
  var $scope, $rootScope, createController;

  beforeEach(module('app'));
  beforeEach(inject(function($injector) {

    // mock out our dependencies
    $rootScope = $injector.get('$rootScope');

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
  it('should have functions for getting dashboard data', function () {
    expect($scope.getDashData).to.be.a('function');
  });

  it('should show only the followed maps to start with', function () {
    expect($scope.showFollowed).to.be.true;
    expect($scope.showMyMaps).to.be.false;
    expect($scope.showCompleted).to.be.false;
  });

  it('should calculate total nodes for maps', function (){
    var testMaps = [{nodes:[1,2]}];
    $scope.addTotalNodesOfMaps(testMaps);
    expect(testMaps[0].totalNodes).to.equal(2);
  });

  it('should add completed nodes', function(){
    $scope.followed = [{
      _id: 0,
      totalNodes: 2
    }];
    
    $scope.myMaps = [{
      _id: 0,
      totalNodes: 2
    }];
    
    var inProgress = {
      roadmaps: [{
        _id: 0,
        nodes: [{
          _id: 1
        }]
      }],
      nodes: [{
          _id: 1
        }]
    };
    $scope.addCompletedNodes(inProgress);
    expect($scope.followed[0].nodesCompleted).to.equal(1);
    expect($scope.followed[0].percentComplete).to.equal(50);
    expect($scope.followed[0].nodesCompleted).to.equal(1);
    expect($scope.followed[0].percentComplete).to.equal(50);
  });

});
