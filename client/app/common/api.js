angular.module('app.common', [])

.factory('API', ['$http', function($http){
  var api = {};

  var encodeAuthHeader = function() {
    var user = localStorage.getItem('user.username');
    var token = localStorage.getItem('user.authToken');
    return btoa(user + ':' + token);
  }

  api.saveRoadmap = function(roadmap) {

   return $http({
      method: 'POST',
      url: '/api/roadmaps',
      data: roadmap,
      headers: { Authorization: 'Basic ' + encodeAuthHeader() }
    }).then(function (res) {
      console.log('Roadmap saved:', res.data.data);
      return res.data.data;
    }).catch(function (err) {
      console.log(err);
    });

  };

  return api;
}]);