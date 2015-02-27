var q = require('q');
var ophan = require('./ophan.js');
var capi = require('./capi.js');
var dapi = require('./dapi.js');
var facebook = require('./facebook.js');
var twitter = require('./twitter.js');

var getOphanMostRead = function() {
  return ophan.getMostReadArticles()
    .then(function(ophanArticles) {
      return ophanArticles.map(function(ophanArticle) {
        return {
          url: ophanArticle.url,
          path: ophanArticle.url.replace('http://www.theguardian.com/', ''),
          viewCount: ophanArticle.count
        }
      });
    });
}

var addCapiData = function(articles) {
  var qWithCapiData = articles.map(function (article) {
    return capi.getContent(article.path)
    .then(function(capiContent) {
      article.headline = capiContent.webTitle;
      article.publishedAt = capi.getPublishedAt(capiContent);
      article.shortUrl = capiContent.fields.shortUrl;
      return article;
    });
  });
  return q.all(qWithCapiData);
}

var addDapiData = function(articles) {
  var shortUrls = articles.map(function(article) {
    return article.shortUrl
  });
  return dapi.getCommentCounts(shortUrls)
  .then(function(commentCounts) {
    return articles.map(function(article) {
      article.commentCount = commentCounts[article.shortUrl];
      return article;
    });
  });
}

var addFacebookData = function(articles) {
  var urls = articles.map(function(article) {
    return article.url
  });
  return facebook.getSocialData(urls)
  .then(function(fbData) {
    return articles.map(function(article) {
      if (!!fbData[article.url]) {
        article.facebookCommentCount = fbData[article.url].comment_count;
        article.facebookLikeCount = fbData[article.url].like_count;
        article.facebookShareCount = fbData[article.url].share_count;
      }
      return article;
    });
  });
}

var addTwitterData = function(articles) {
  var qWithTwitterData = articles.map(function (article) {
    return twitter.getShareCount(article.url)
    .then(function(shareCount) {
      article.twitterShareCount = shareCount;
      return article;
    });
  });
  return q.all(qWithTwitterData);
}

var addImportance = function(articles) {
  return articles.map(function(article) {
    // TODO magic importance score
    article.importance = 3;
    return article;
  });
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
  .then(addDapiData)
  .then(addFacebookData)
  .then(addTwitterData)
  .then(addImportance)
  .then(sortByPublishedAt);
}

module.exports = {
  getTimeline: getTimeline
}
