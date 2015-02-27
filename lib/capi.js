var httpclient = require('./httpclient');

var getContent = function(path) {
  return httpclient('http://content.guardianapis.com/' + path + '?api-key=gnm-hackday&show-fields=firstPublicationDate,shortUrl,thumbnail')
  .then(function(capiResponse) {
    return capiResponse.response.content;
  });
}

var getContentsWithTag = function(tag, from, to) {
  var fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - 7);
  var toDate = new Date();

  if (from) {
    fromDate = new Date(parseInt(from));
    console.log('From: ' + fromDate);
  }
  if (to) {
    toDate = new Date(parseInt(to));
    console.log('To: ' + toDate);
  }

  var fromDateParam = fromDate.getFullYear() + '-' + (fromDate.getMonth() + 1) + '-' + fromDate.getDate();
  var toDateParam = toDate.getFullYear() + '-' + (toDate.getMonth() + 1) + '-' + toDate.getDate();

  return httpclient('http://content.guardianapis.com/search?api-key=gnm-hackday&show-fields=firstPublicationDate,shortUrl,thumbnail&page-size=20&order-by=relevance&from-date=' + fromDateParam + '&to-date=' + toDateParam + '&tag=' + tag)
  .then(function(capiResponse) {
    return capiResponse.response.results;
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
  getContentsWithTag: getContentsWithTag,
  getPublishedAt: getPublishedAt
}
