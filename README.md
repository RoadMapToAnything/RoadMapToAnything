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
This will handle both client and server-side dependencies as outlined in [package.json](package.json) and [bower.json](bower.json).

### Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.


## Internal APIs
On any project there are many internal APIs. For ease of reference, for both the development team and future contributers, they are exhaustively documented here.

### Test Data

In order to help test various aspects of Roadmap To Anything, test data can be seeded from [testData.json](specs/data/testData.json) into either the main database, or a quarantined test database. This can be done with one of a few npm scripts:

```sh
npm run seed
```

Seed the main database with test data, if it does not already exist.

```sh
npm run clear
```

Remove the test data (but no other data) from the main database.

```sh
npm run reset
```

Will clear the test data, and then reseed it. Additionally, `-test` can be added after any of these calls to modify the test database instead of the main one. For example, before running any tests, `npm test` automatically runs the following command:

```sh
npm run reset-test
```

### DB Schema
There are three types of objects stored in the database: users, roadmaps, and nodes. To minimize http requests on the server, when retrieved, all references to other objects will be fully populated with complete objects, not just is numbers. The schema are as follows:

####[User](server/api/users/userModel.js)
```javascript
{
  username           :  ...   // String
  password           :  ...   // String
  firstName          :  ...   // String
  lastName           :  ...   // String
  imageUrl           :  ...   // String
  authoredRoadmaps   : [...]  // Array of Roadmap references
  inProgress.roadmaps: [...]  // Array of Roadmap references
  inProgress.nodes   : [...]  // Array of Node references
  completedRoadmaps  : [...]  // Array of Roadmap references
  created            :  ...   // Date
  updated            :  ...   // Date 
}

```

####[Roadmap](server/api/roadmaps/roadmapModel.js)
```javascript
{
  title      :  ...   // String
  description:  ...   // String
  author     :  ...   // User reference
  nodes      : [...]  // Array of Node references
  created    :  ...   // Date 
  updated    :  ...   // Date 
}

```

####[Node](server/api/nodes/nodeModel.js)
```javascript
{
  title        :  ...  // String
  description  :  ...  // String
  resourceType :  ...  // String
  resourceURL  :  ...  // String
  imageUrl     :  ...  // String
  parentRoadmap:  ...  // Roadmap reference
  created      :  ...  // Date
  updated      :  ...  // Date
}

```

####[Comment](server/api/comments/commentModel.js)
```javascript
{
  subject:  ...  // String
  content:  ...  // String
  author :  ...   // User reference
  roadmap:  ...  // Roadmap reference
  created:  ...  // Date
  updated:  ...  // Date
}

```

### Server API
The server uses a stateless RESTful API for all database access. It supports four HTTP verbs: `GET` for retrieving data, `POST` for creating new objects, `PUT` for updating existing objects, and `DELETE` for removing objects. *NOTE: All `POST`, `PUT`, and `DELETE` routes require an authorization token, with the exception of `POST /api/signup`.*

#### The Routes
Most routes follow a `/api/:data_type/:data_identifier` pattern. Note that when an aspect of a route is prefaced with a colon `:` it refers to a variable. Do not actually write down a colon in any api calls. Additionally, ALL of the following routes must be prefaced with `/api`.

```javascript
GET     /login                // Authenticate user
POST    /signup               // Create a user

GET     /users                // Get an array of users 
GET     /users/:username      // Get a specific user
PUT     /users/:username      // Update the user's info
DELETE  /users/:username      // Delete the user


GET     /roadmaps             // Get an array of roadmaps
GET     /roadmaps/:roadmapId  // Get a specific roadmap
POST    /roadmaps             // Create a new roadmap
PUT     /roadmaps/:roadmapId  // Update a roadmap
DELETE  /roadmaps/:roadmapId  // Delete a roadmap

GET     /nodes/:nodeId        // Get a specific node
POST    /roadmaps/:roadmapID/nodes    // Create a new node
POST    /nodes                // Create a new node
PUT     /nodes/:nodeId        // Update a node
DELETE  /nodes/:nodeId        // Delete a node

PUT     /roadmaps/:roadmapId/follow   // Authorized user follows roadmap
PUT     /roadmaps/:roadmapId/unfollow // Authorized user unfollows roadmap
PUT     /nodes/:nodeId/complete       // Authorized user completes node
PUT     /roadmaps/:roadmapId/complete // Authorized user completes roadmap
```

#### Query Strings
In order for a user to login, their credentials must be passed through the following query string appended to `/api/login`:
```javascript
?username=:username&password=:password
```
Remember the colons demarcate variables and should not actually be written out!

In addition, the following query strings are supported on any of the nonspecific `GET` routes which send back an array of objects. Support for other query strings may be implemented at a later date.

```javascript
?sort=:property     // Sorts results ascending by the given :property
?sort=-:property    // Sorts results in descending order

?:property=:value   // Filters results for a :property equaling :value
?:property=>:value  // Filters results for a :property which is greater than :value
?:property=<:value  // Filters results for a :property which is less than :value
```

### Client Services

A number of Angular factories have been built in order to centralize many common client-side tasks. In order to use these factories in a module, make sure they are properly injected. For example, to inject the User factory:
```javascript
angular.module('example.ctrl', ['services.user'])

.controller('DashboardController', ['$scope', 'User', function($scope, User) {
  ...
}]);

```

The methods available on each factory are detailed below:

####[User Factory](client/app/services/userFactory.js) 
**`User`** | **`services.user`**<br>
Contains various methods for modifying and accessing data related to the currently logged in user. Most require the user to be authorized with a hashed token stored at `user.authToken` in local storage.

**User.getData()**<br>
_!!requires authorization_<br>
Returns a promise with a user object that contains all of the current user's data, with all fields fully populated.

**User.login( username, password )**<br>
With correct credentials, logs the user in, setting `user.username` and `user.authToken` in local storage. Returns a promise with the username and authToken.

**User.signup( user )**<br>
Signs up and logs in a new user. Takes a user object as a parameter. Returns a promise with the new user object.

**User.logout()**<br>
Removes the user's username and authToken from local storage.

**User.isLoggedIn()**<br>
Returns `true` if the user has credentials in local storage, `false` if they do not.

**User.followRoadmapById( roadmapId )**<br>
_!!requires authorization_<br>
*aliases: followRoadmap, followMap, follow*<br>
Accepts a roadmap id, and adds that roadmap to the user's `inProgress` array. Returns a promise with the entire user object.

**User.unfollowRoadmapById( roadmapId )**<br>
_!!requires authorization_<br>
*aliases: unfollowRoadmap, unfollowMap, unfollow*<br>
Accepts a roadmap id, and removes that roadmap to the user's `inProgress` array. Returns a promise with the entire user object.

**User.completeNodeById( nodeId )**<br>
_!!requires authorization_<br>
*aliases: completeNode*<br>
Accepts a node id, and adds that node to the user's `inProgress` array. Returns a promise with the entire user object.

**User.completeRoadmapById( roadmapId )**<br>
_!!requires authorization_<br>
*aliases: completeRoadmap, completeMap*<br>
Accepts a roadmap id, and adds that roadmap to the user's `completed` array. Removes the corresponding roadmap and nodes from `inProgress`. Returns a promise with the entire user object.

**User.upvoteRoadmapById( roadmapId )**<br>
_!!requires authorization_<br>
*aliases: upvoteMapById, upvoteRoadmap, upvoteMap, upvote*<br>
Accepts a roadmap id, and add user id to the roadmap's `upvotes` array.
Removes the user id from the roadmap's `downvotes` array if it exists there.
Returns a promise with the entire roadmap object.

**User.downvoteRoadmapById( roadmapId )**<br>
_!!requires authorization_<br>
*aliases: downvoteMapById, downvoteRoadmap, downvoteMap, downvote*<br>
Accepts a roadmap id, and add user id to the roadmap's `downvotes` array.
Removes the user id from the roadmap's `upvotes` array if it exists there.
Returns a promise with the entire roadmap object.


**User.getRoadmapProgress( [user], [roadmapId] )**<br>
_!!requires authorization_<br>
*aliases: getMapProgress, getProgress*<br>
Accepts the optional parameters of a user object and/or a roadmap id. If no user is passed, the function becomes asynchronus as user information will be fetched from the server, and a promise will be returned. If a roadmap id is passed then the progress data for the specified roadmap will be returned. If no roadmap id is passed, then an array with the progress data for all of the user's `inProgress` roadmaps will be returned. Progress data looks like this:
```javascript
{
  _id:        // The corresponding roadmap's id
  total:      // The total number of nodes in the roadmap
  completed:  // The number of nodes the user completed
  percent:    // A completion percentage, out of 100
}
```

####[Server Factory](client/app/services/serverFactory.js) 
**`Server`** | **`services.server`**<br>
Contains various methods for modifying and accessing data related to foreign objects in the database: roadmaps, nodes, and other users. Most require the user to be authorized with `user.authToken` in local storage. All of these methods are asynchronus and return a promise.

**Server.getUsers( [query] )**<br>
Accepts an optional query string parameter as object notation. For example: `{sort: '-created'}`. Returns a promise with an array of every user object.

**Server.getUserByUsername( username )**<br>
*aliases: getUser*<br>
Accepts a username. Returns a promise with the corresponding user object.

**Server.updateUser( user )**<br>
_!!requires authorization_<br>
Accepts a user object, and updates that user with any properties included in the object. Returns a promise with the new user object.

**Server.deleteUserByUsername( username )**<br>
_!!requires authorization_<br>
*aliases: deleteUser*<br>
Accepts a username, and removes that user from the database. Returns a promise with the deleted user object.

**Server.getRoadmaps( [query] )**<br>
*aliases: getMaps*<br>
Accepts an optional query string parameter as object notation. Returns a promise with an array of every roadmap object.

**Server.getRoadmapById( roadmapId )**<br>
*aliases: getMapById, getRoadmap, getMap*<br>
Accepts a roadmap id. Returns a promise with the corresponding roadmap object.

**Server.createRoadmap( roadmap )**<br>
_!!requires authorization_<br>
*aliases: createMap*<br>
Accepts a roadmap object and builds a new roadmap in the database with the values in that object. Returns a promise with the new roadmap object.

**Server.updateRoadmap( roadmap )**<br>
_!!requires authorization_<br>
*aliases: updateMap*<br>
Accepts a roadmap object, and updates that roadmap with any properties included in the object. Returns a promise with the new roadmap object.

**Server.deleteRoadmapById( roadmapId )**<br>
_!!requires authorization_<br>
*aliases: deleteMapById, deleteRoadmap, deleteMap*<br>
Accepts a roadmap id, and removes that roadmap from the database. Returns a promise with the deleted roadmap object.

**Server.getNodeById( nodeId )**<br>
*aliases: getNode*<br>
Accepts a node id. Returns a promise with the corresponding node object.

**Server.createNode( node )**<br>
_!!requires authorization_<br>
Accepts a node object and builds a new node in the database with the values in that object. Returns a promise with the new node object.

**Server.updateNode( node )**<br>
_!!requires authorization_<br>
Accepts a node object, and updates that node with any properties included in the object. Returns a promise with the new node object.

**Server.deleteNodeById( nodeId )**<br>
_!!requires authorization_<br>
*aliases: deleteNode*<br>
Accepts a node id, and removes that node from the database. Returns a promise with the deleted node object.

**Server.createComment( comment )**<br>
_!!requires authorization_<br>
*aliases: deleteNode*<br>
Accepts a comment object, and adds that comment to the database. Must have a populated `roadmap` property, but `author` is populated automatically. Returns a promise with the created comment object.

**Server.deleteCommentById( commentId )**<br>
_!!requires authorization_<br>
*aliases: deleteComment*<br>
Accepts a comment id, and removes that comment from the database. Returns a promise with the deleted comment object.

**Server.scrapeUrl( url )**<br>
_!!requires authorization_<br>
*aliases: scrape*<br>
Accepts a url. Returns a promise with an object that contains a variety of information related to the url. The value of each property is a string. Properties not found are not returned.
```javascript
{
  title      :  ...  // The title of the individual page
  imageUrl   :  ...  // The url of a header image
  description:  ...  // A description of the individual page
  type       :  ...  // What type of page it is
  siteName   :  ...  // The name of the site hosting the page
  siteIcon   :  ...  // The url of the icon for that site
  author     :  ...  // The name of the content's author (experiemental)
  price      :  ...  // The price of the course (experimental)
  duration   :  ...  // The duration of the video (experimental)
}
```

####[Request Factory](client/app/services/requestFactory.js) 
**`Request`** | **`services.request`**<br>
Very similar to angular's built in `$http` method, but handles default logging, errory handling, and auth headers. Limited to only the funcionality listed below, this factory none the less should be used in all places that `$http` would be used, but `User` and `Server` would not.

**Request( params )**<br>
Handles all http requests, with the additional option to handle logging, formatting, and errors. Generally speaking, this method should not be called directly, instead use the get, post, put, and delete convenience methods.

Looks for the following parameters:
- method: String, the http method
- url: String, the url
- data: Object, either data or query, depending on method
- options: Object, has any of the following properties (all default to true):
  - auth: if true, sets standard auth headers
  - log: if true, console logs the response 
  - format: if true, sends back response.data.data
  - err: if true, catches and logs any errors

Returns a promise.

**Request.get( url, [query], [options] )**<br>
Handles all GET requests. Accepts a url string, and optional query and options objects. Defaults `auth` to false. Returns a promise.

**Request.post( url, [data], [options] )**<br>
Handles all POST requests. Accepts a url string, and optional data and options objects. Returns a promise.

**Request.put( url, [data], [options] )**<br>
Handles all PUT requests. Accepts a url string, and optional data and options objects. Returns a promise.

**Request.delete( url, [options] )**<br>
Handles all DELETE requests. Accepts a url string, and an optional options object. Returns a promise.