var q = require('q');
var ophan = require('./ophan.js');
var capi = require('./capi.js');

var getOphanMostRead = function() {
  return ophan.getMostReadArticles();
}

var addCapiData = function(ophanArticles) {
  var qWithCapiData = ophanArticles.map(function (ophanArticle) {
    var path = ophanArticle.url.replace('http://www.theguardian.com/', '');
    var viewCount = ophanArticle.count;
    return capi.getContent(path)
    .then(function(capiContent) {
      return {
        path: path,
        viewCount: viewCount,
        headline: capiContent.webTitle,
        publishedAt: capi.getPublishedAt(capiContent)
      }
    });
  });
  return q.all(qWithCapiData);
}

var sortByPublishedAt = function(articles) {
  return articles.sort(function(a, b) {
    return a.publishedAt - b.publishedAt;
  });
}

/**
 * Returns a promise of a time-ordered list of articles
 */
var getTimeline = function() {
  return getOphanMostRead()
  .then(addCapiData)
  .then(sortByPublishedAt);
}

module.exports = {
  getTimeline: getTimeline
}
