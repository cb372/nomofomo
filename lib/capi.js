var httpclient = require('./httpclient');

var getContent = function(path) {
  return httpclient('http://content.guardianapis.com/' + path + '?api-key=gnm-hackday&show-fields=firstPublicationDate,shortUrl')
  .then(function(capiResponse) {
    return capiResponse.response.content;
  });
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
