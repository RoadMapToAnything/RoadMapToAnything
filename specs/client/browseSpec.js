describe('DashboardController', function () {
  var $scope, $rootScope, $location, createController, $httpBackend, $stateParams;

  beforeEach(module('app'));
  beforeEach(inject(function($injector) {

    // mock out our dependencies
    $rootScope = $injector.get('$rootScope');
    $httpBackend = $injector.get('$httpBackend');
    $location = $injector.get('$location');
    $stateParams = injector.get('$stateParams');

    $scope = $rootScope.$new();

    var $controller = $injector.get('$controller');

    createController = function () {
      return $controller('DashboardController', {
        $scope: $scope
      });
    };

    createController();
  }));

  xit('should have the search param in the url query', function (){
    expect(typeof $stateParams.search).to.be(false);
  });
  xit('should have the filter param in the url query', function (){
    expect(typeof $stateParams.filter).to.be.a('string');
  });

  it('should have a function to populate browse page', function (){
    expect($scope.populateMapData).to.be.a('function');
  });

  it('should have a function to embark on a map', function (){
    expect($scope.embark).to.be.a('function');
  });






});