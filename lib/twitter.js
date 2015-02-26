var httpclient = require('./httpclient');

var getShareCount = function(url) {
  return httpclient('https://cdn.api.twitter.com/1/urls/count.json?url=' + url)
  .then(function(twitterResponse) {
    return twitterResponse.count;
  });
}

module.exports = {
  getShareCount: getShareCount,
}
