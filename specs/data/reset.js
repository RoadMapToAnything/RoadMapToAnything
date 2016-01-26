var testData = require('./testData.js'),
    mongoose = require('mongoose');

var database = process.env.MONGOLAB_URI || 'mongodb://localhost/roadmapToAnything';
mongoose.connect(database);

console.log('RESETING DATA...');

testData.clearData(function(){
  testData.seedData(function(){
    mongoose.disconnect();
    console.log('DONE!!');
  });
});
