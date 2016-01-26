var testData = require('./testData.js'),
    mongoose = require('mongoose');

var database = process.env.MONGOLAB_URI || 'mongodb://localhost/roadmapToAnything';
mongoose.connect(database);

console.log('CLEARING DATA...');

testData.clearData(function(){
  mongoose.disconnect();
  console.log('DONE!!');
});