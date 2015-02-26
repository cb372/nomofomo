var q = require('q');
var ophan = require('./ophan.js');
var capi = require('./capi.js');

/**
 * Returns a promise of a time-ordered list of articles
 */
var getTimeline = function() {
  // TODO refactor this mess
  var pCapiContents = ophan.getMostReadArticles()
  .then(function(ophanArticles) { 
    return ophanArticles.map(function (ophanArticle) {
      var path = ophanArticle.url.replace('http://www.theguardian.com/', '');
      var viewCount = ophanArticle.count;
      return capi.getContent(path)
      .then(function(capiContent) {
        console.log(capiContent);
        return {
          path: path,
          viewCount: viewCount,
          headline: capiContent.webTitle,
          publishedAt: capi.getPublishedAt(capiContent)
        }
      });
    });
  });

  return q.all(pCapiContents)
    .then(function(articles) {
      return articles.sort(function(a, b) {
        return a.publishedAt - b.publishedAt;
      });
    });
}

module.exports = {
  getTimeline: getTimeline
}
