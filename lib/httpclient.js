var request = require('request');
var q = require('q');

/**
 * GETs a URL and parses the JSON response. 
 * @return a promise
 */
var getUrl = function(url) {
  var deferred = q.defer();
  console.log('GETting ' + url);
  request(url, function(error, response, body) {
    if (!!error) {
      deferred.reject(error);
    } else {
      if (response.statusCode >= 200 && response.statusCode < 300) {
        deferred.resolve(JSON.parse(body));
      } else {
        console.log(body);
        deferred.reject(new Error('Response from ' + url + ' had status code ' + response.statusCode));
      }
    }
  });
  return deferred.promise;
}

module.exports = getUrl
