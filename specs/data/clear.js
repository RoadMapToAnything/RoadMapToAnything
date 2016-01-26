var handleData = require('./handleData.js'),
    db = require('mongoose'),
    DB_URI = require('../../_config.json').DB_URI;

var database = process.env.MONGOLAB_URI || DB_URI;
db.connect(database);

console.log('Clearing data...');

handleData.clearData(function(){
  db.disconnect();
  console.log('Done!!');
});