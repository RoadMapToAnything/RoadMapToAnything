var request = require('request-promise');

module.exports = function (url) {
  return request(url)
  .then(function (result) {
    console.log(result.substring(0, 100));
    return result.substring(0, 100);
  });
};