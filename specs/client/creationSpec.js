// angular.module('creation.ctrl', ['services.server'])

describe('CreationController', function () {
  var $scope, $rootScope, createController, $state, Server;

  beforeEach(module('app'));
  beforeEach(inject(function($injector) {

    // mock out our dependencies
    $rootScope = $injector.get('$rootScope');
    $state = $injector.get('$state');
    Server = $injector.get('Server');
    $scope = $rootScope.$new();

    var $controller = $injector.get('$controller');

    createController = function () {
      return $controller('CreationController', {
        $scope: $scope
      });
    };

    createController();
  }));


  it('should have a default node type', function (){
    expect($scope.nodeType).to.equal('Blog Post');
  });

  it('should have a default node type', function (){
    expect($scope.createRoadmap).to.be.a('function');
  });

  it('should have a default node type', function (){
    expect($scope.createNode).to.be.a('function');
  });

  it('should have a default node type', function (){
    expect($scope.checkThenCreate).to.be.a('function');
  });

  it('should have a default node type', function (){
    expect($scope.submitAndRefresh).to.be.a('function');
  });

  it('should have a default node type', function (){
    expect($scope.submitAndExit).to.be.a('function');
  });

});


