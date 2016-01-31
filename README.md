# Roadmap To Anything

For anything you want to learn, there are a lot of useful, but unconnected resources out there. Our platform lets people build gamified learning paths for each other called roadmaps.


## Team

  - __Product Owner__: Zac Delventhal
  - __Scrum Master__: Sean Reimer
  - __Development Team Members__: Brendan Grady, Irene Koan, Gabe Meyr


## Table of Contents

1. [Team](#team)
2. [Usage](#Usage)
3. [Development](#development)
  1. [Installing Dependencies](#installing-dependencies)
  2. [Contributing](#contributing)
4. [Internal APIs](#internal-apis)
  1. [Test Data](#test-data)
  2. [DB Schema](#db-schema)
  3. [Server API](#server-api)
  4. [Client Services](#client-services)


## Usage

As soon as users land on the homepage, they will see a selection of amazing roadmaps built by our users. These roadmaps provide step-by-step instructions and links to resources for anyone who is interested in learning about a subject. If a user creates an account, they can track their progress, vote roadmaps up or down, and create some of their own.


## Development

### Installing Dependencies

Make sure you have [Node](https://nodejs.org/en/) installed, and then from within the root directory:

```sh
npm install
```
This will handle both client and server-side dependencies as outlined in [package.json](/blob/master/package.json) and [bower.json](/blob/master/bower.json).

### Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.


## Internal APIs

### Test Data

In order to help test various aspects of Roadmap To Anything, test data can be seeded from [testData.json](/blob/master/specs/data/testData.json) into either the main database, or a seperate test database. This can be done with one of a few npm scripts:
```sh
npm run seed
```

Will seed the main database with test data, if it does not already exist.
```sh
npm run clear
```

Will remove the test data (but no other data) from the main database.
```sh
npm run reset
```

Will clear the test data, and then reseed it. Additionally, the optional `-test` flag can be added after any of these calls to modify the test database instead of the main one. `npm test` will autmoatically run the following command before running any tests:
```sh
npm run reset -test
```

### DB Schema
There are three types of objects stored in the database. When retrieved from the server, all references to other database objects will be fully populated with complete objects. These objects have the following properties:

####[User](/blob/master/server/api/users/userModel.js)
```javascript
{
  username           : ... // String
  password           : ... // String
  firstName          : ... // String
  lastName           : ... // String
  imageUrl           : ... // String
  authoredRoadmaps   : [...] // Array of Roadmap references
  inProgress.roadmaps: [...] // Array of Roadmap references
  inProgress.nodes   : [...] // Array of Node references
  completedRoadmaps  : [...] // Array of Roadmap references
  created            : ... // Date
  updated            : ... // Date 
}

```

####[Roadmap](/blob/master/server/api/roadmaps/roadmapModel.js)
```javascript
{
  title      : ... // String
  description: ... // String
  author     : ... // User reference
  nodes      : [...] // Array of 
  created    : ... // Date 
  updated    : ... // Date 
}

```

####[Node](/blob/master/server/api/nodes/nodeModel.js)
```javascript
{
  title        : ... // String
  description  : ... // String
  resourceType : ... // String
  resourceURL  : ... // String
  imageUrl     : ... // String
  parentRoadmap: ... // Roadmap reference
  created      : ... // Date
  updated      : ... // Date
}

```

### Client Services

A number of Angular factories have been built in order to centralize many common client-side tasks. In order to use these factories in a module, make sure they are properly injected. For example, to inject the User factory:
```javascript
angular.module('example.ctrl', ['services.user'])

.controller('DashboardController', ['$scope', 'User', function($scope, User){
  ...
}]);

```

The methods available on each factory are detailed below:

####[User Factory](/blob/master/client/app/services/userFactory.js) ('services.user')**
Contains varios methods for modifying and accessing data related to the currently logged in user.

**User.getData()**
Returns a promise with a user object that contains all of the current user's data, with all fields fully populated.

**User.login(username, password)**
With correct credentials, logs the user in, setting `user.username` and `user.authToken` to local storage. Returns a promise with the username and authToken.

**User.signup(user)**
Signs up and logs in a new user. Takes a user object as a parameter. Returns a promise with the new user object.

**User.logout()**
Removes the user's username and authToken from local storage.

**User.isLoggedIn()**
Returns `true` if the user has credentials in local storage, `false` if they do not.

**User.followRoadmapById(roadmapId)**
*aliases: followRoadmap, followMap, follow*
Accepts a roadmap id, and adds that roadmap to the user's `inProgress` array. Returns a promise with the entire user object.

**User.unfollowRoadmapById(roadmapId)**
*aliases: unfollowRoadmap, unfollowMap, unfollow*
Accepts a roadmap id, and removes that roadmap to the user's `inProgress` array. Returns a promise with the entire user object.

**User.completeNodeById(nodeId)**
*aliases: completeNode*
Accepts a node id, and adds that node to the user's `inProgress` array. Returns a promise with the entire user object.

**User.completeRoadmapById(roadmapId)**
*aliases: completeRoadmap, completeMap*
Accepts a roadmap id, and adds that roadmap to the user's `completed` array. Removes the corresponding roadmap and nodes from `inProgress`. Returns a promise with the entire user object.

**User.getRoadmapProgress([user], [roadmapId])**
*aliases: getMapProgress, getProgress*
Accepts a user object and/or a roadmap id. If no user is passed, then it will be fetched from the server, and a promise will be returned. If a roadmap id is passed then the progress data for the specified roadmap will be returned. If no roadmap id is passed, then an array with the progress data for all of the user's `inProgress` roadmaps will be returned. Progress data is formatted like this:
```javascript
{
  _id: // The corresponding roadmap's id
  total: // The total number of nodes in the roadmap
  completed: // The number of nodes the user completed
  percentage: // A completion percentage, out of 100
}

```