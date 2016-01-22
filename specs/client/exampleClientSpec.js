// Karma handles declaring 'expect' and 'should' automatically.
describe('Testing through the browser.', function() {

  it('is should have a window and a document body', function() {
    window.should.exist;
    document.body.should.exist;
  });

  it('is expected to not be able to use require', function() {
    expect(typeof require).to.equal('undefined');
  });

});

describe('MainController', function () {
  var $scope, $rootScope, $location, createController, $httpBackend;

  // using angular mocks, we can inject the injector
  // to retrieve our dependencies
  beforeEach(module('app'));
  beforeEach(inject(function($injector) {

    // mock out our dependencies
    $rootScope = $injector.get('$rootScope');
    $httpBackend = $injector.get('$httpBackend');
    $location = $injector.get('$location');

    $scope = $rootScope.$new();

    var $controller = $injector.get('$controller');

    createController = function () {
      return $controller('MainController', {
        $scope: $scope
      });
    };

    createController();
  }));

  it('should have a test method on the $scope', function () {
    expect($scope.test).to.be.a('function');
  });

});
