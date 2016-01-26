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


  it('should get a 401 when credentials bad', function () {
    $scope.attemptedUsername = 'noone-should-ever-pick-this-name';
    $scope.attemptedLogin = 'or-this-password!#$';
    return $scope.attemptLogin()
      .then(function(response){
        expect(response.status).to.be.equal.to(401);
      });
  });

  xit('should get a 200 when credentials good', function () {
    $scope.attemptedUsername = 'a';
    $scope.attemptedLogin = 'a';
    return $scope.attemptLogin()
      .then(function(response){
        expect(response.status).to.be.equal.to(200);
      });
  });
});
