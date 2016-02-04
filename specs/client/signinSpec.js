describe('AuthController', function () {
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
      return $controller('AuthController', {
        $scope: $scope
      });
    };

    createController();
  }));

  it('should have an attemptLogin function', function () {
    expect($scope.attemptLogin).to.be.a('function');
  });


  it('should have a username on the model', function () {
    expect($scope.attemptedUsername).to.equal("");
  });

  it('should have a password on the model', function () {
    expect($scope.attemptedPassword).to.equal("");
  });
  
  it('should not start out showing msg about bad credentials', function (){
    expect($scope.showUnauthMsg).to.be.false;
  });
  
  it('should show signin page before signup', function(){
    expect($scope.signin).to.be.true;
  });

  it('should change to signup page and clear inputs', function(){
    $scope.attemptedUsername = "test";
    $scope.attemptedPassword = "test";
    $scope.attemptedFirstName = 'test';
    $scope.attemptedLastName = 'test';

    $scope.showSignup();
    expect($scope.signin).to.be.false;
    expect($scope.attemptedUsername).to.equal("");
    expect($scope.attemptedPassword).to.equal("");
    expect($scope.attemptedFirstName).to.equal("");
    expect($scope.attemptedLastName).to.equal("");
  });

  it('should change to signin page and clear inputs', function(){
    $scope.attemptedUsername = "test";
    $scope.attemptedPassword = "test";
    $scope.attemptedFirstName = 'test';
    $scope.attemptedLastName = 'test';

    $scope.showSignin();
    expect($scope.signin).to.be.true;
    expect($scope.attemptedUsername).to.equal("");
    expect($scope.attemptedPassword).to.equal("");
    expect($scope.attemptedFirstName).to.equal("");
    expect($scope.attemptedLastName).to.equal("");
  });

});
