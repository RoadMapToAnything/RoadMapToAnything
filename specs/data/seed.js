var handleData = require('./handleData.js'),
    db = require('mongoose'),
    DB_URI = require('../../_config.json').DB_URI;

var database = process.env.MONGOLAB_URI || DB_URI;
db.connect(database);

console.log('Seeding data...');

handleData.checkData(function() {
  handleData.seedData(function() {
    db.disconnect();
    console.log('Done!!');
  });
}, function() {
  db.disconnect();
  console.log('Canceling. Data already exists.');
});