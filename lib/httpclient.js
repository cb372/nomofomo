var request = require('request');
var q = require('q');

/**
 * GETs a URL and parses the JSON response. 
 * @return a promise
 */
var getUrl = function(url) {
  var deferred = q.defer();
  request(url, function(error, response, body) {
    if (!!error) {
      deferred.reject(error);
    } else {
      deferred.resolve(JSON.parse(body));
    }
  });
  return deferred.promise;
}

module.exports = getUrl
