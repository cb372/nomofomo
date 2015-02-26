var httpclient = require('./httpclient');

var getCommentCounts = function(shortUrls) {
  var shortUrlsParam = 
    shortUrls.map(function(shortUrl) {
      return shortUrl.replace('http://gu.com', '');
    })
    .join();
  return httpclient('http://discussion.guardianapis.com/discussion-api/getCommentCounts?short-urls=' + shortUrlsParam)
  .then(function(response) {
    var result = {};
    Object.keys(response).forEach(function(key) {
      var shortUrl = 'http://gu.com' + key;
      result[shortUrl] = response[key];
    });
    return result;
  });
}

module.exports = {
  getCommentCounts: getCommentCounts,
}
