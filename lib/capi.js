var request = require('request');
var q = require('q');

var getContent = function(path) {
  var deferred = q.defer();
  request('http://content.guardianapis.com/' + path + '?api-key=gnm-hackday&show-fields=firstPublicationDate', function(error, response, body) {
    if (!!error) {
      deferred.reject(error);
    } else {
      deferred.resolve(JSON.parse(body).response.content);
    }
  });
  return deferred.promise;
}

var getPublishedAt = function(content) {
  var publishedAt;
  if (content.fields.hasOwnProperty('firstPublicationDate')) {
    publishedAt = content.fields.firstPublicationDate;
  } else {
    publishedAt = content.webPublicationDate;
  }
  return new Date(publishedAt).getTime();
}

module.exports = {
  getContent: getContent,
  getPublishedAt: getPublishedAt
}
