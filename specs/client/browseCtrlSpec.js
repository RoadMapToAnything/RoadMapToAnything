describe('BrowseController', function () {
  var $scope, $rootScope, createController;

  beforeEach(module('app'));
  beforeEach(inject(function($injector) {

    // mock out our dependencies
    $rootScope = $injector.get('$rootScope');


    $scope = $rootScope.$new();

    var $controller = $injector.get('$controller');

    createController = function () {
      return $controller('BrowseController', {
        $scope: $scope
      });
    };

    createController();
  }));


  xit('should have a function to populate browse page', function (){
    expect($scope.getMapData).to.be.a('function');
  });

  xit('should have a function to go to dashboard', function (){
    expect($scope.goToDash).to.be.a('function');
  });

  xit('should have a function to add up node totals', function (){
    expect($scope.addTotalNodesOfMaps).to.be.a('function');
  });






});