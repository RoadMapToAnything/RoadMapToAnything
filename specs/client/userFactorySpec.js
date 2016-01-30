// TODO: Refactor the following into a real test

/*

  var mapId = '000000000000000000000010';
  var nodeId = '000000000000000000000100';

  User.followRoadmapById(mapId)
  .then(function (user) {
    console.log('Progress on one', User.getRoadmapProgress(user, mapId) );

    return User.completeNodeById(nodeId)
  })

  .then(function (user) {
    console.log('Progress on all', User.getRoadmapProgress(user) );

    return User.getProgress();
  })

  .then(function (progress) {
    console.log('Async Progress', progress);

    return User.getData();
  })

  .then(function (user) {
    console.log('User data', user);

    User.followRoadmap(mapId);
    User.followMap(mapId);
    User.follow(mapId);

    User.unfollowRoadmapById(mapId);
    User.unfollowRoadmap(mapId);
    User.unfollowMap(mapId);
    User.unfollow(mapId);

    User.completeNode(nodeId);

    User.completeRoadmapById(mapId);
    User.completeRoadmap(mapId);
    return User.completeMap(mapId);
  })

  .then(function (user) {
    console.log('User at end', user);
  });

*/