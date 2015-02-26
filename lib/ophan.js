var request = require('request');
var q = require('q');

var getMostReadArticles = function() {
  var deferred = q.defer();
  request('http://api.ophan.co.uk/api/mostread?api-key=cb372', function(error, response, body) {
    if (!!error) {
      deferred.reject(error);
    } else {
      deferred.resolve(JSON.parse(body));
    }
  });
  return deferred.promise;
}


module.exports = {

  getMostReadArticles: getMostReadArticles

}
