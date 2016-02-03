var handleData = require('./handleData.js'),
    db = require('mongoose'),
    DB_URI = require('../../_config.json').DB_URI;

var finish = function(results) {
  results.forEach(function (result) {
    console.log(result);
  });

  db.disconnect();
  console.log('Done!!');
};

var runMode = {

  seed: function() {
    console.log('Seeding test data...');
    handleData.checkData(function() {
      handleData.seedData(function(results) {
        finish(results);
      });
    }, function() {
      console.log('Canceling. Data already exists.');
      finish();
    });
  },

  clear: function() {
    console.log('Clearing test data...');
    handleData.clearData(function(){
      finish([]);
    });
  },

  reset: function() {
    console.log('Resetting test data...');
    handleData.clearData(function(){
      handleData.seedData(function(results){
        finish(results);
      });
    });
  }

};

// Connect to the appropriate DB and run in the appropriate mode
var database = process.env.MONGOLAB_URI || DB_URI.MAIN;
if (process.argv[3] === 'test') {
  database = DB_URI.TEST;
  process.env.NODE_ENV = 'test';
}

// Suppress console logs when testing
require("log-suppress").init(console, 'test');

db.connect(database);
runMode[process.argv[2]]();

