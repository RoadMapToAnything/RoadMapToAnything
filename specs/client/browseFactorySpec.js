describe('Browse Factory', function () {
  var $scope, $rootScope, Server;

  // using angular mocks, we can inject the injector
  // to retrieve our dependencies
  beforeEach(module('browse.factory'));
  beforeEach(inject(function($injector) {

    // mock out our dependencies
    $rootScope = $injector.get('$rootScope');
    Server = $injector.get('Server');
    Browse = $injector.get('Browse');
    $scope = $rootScope.$new();
  }));

  describe('Browse Factory', function() {

    xit('Should add total nodes of maps', function() {
      var testData = [{
        nodes: [1,2,3]
      }];

      Browse.addTotalNodesOfMaps(testData);

      expect(testData[0].totalNodes).to.equal(3);
    });

    it('Should get map data', function(){
      var testFn = function(data){
        expect(Array.isArray(data)).to.be.true;
      }
      Browse.getMapData(testFn);
    });

  });
});
