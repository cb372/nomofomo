var httpclient = require('./httpclient');

var getSocialData = function(urls) {
  return httpclient('http://api.facebook.com/restserver.php?method=links.getStats&format=json&urls=' + urls.join())
  .then(function(response) {
    var result = {};
    response.forEach(function(item) {
      result[item.url] = item;
    });
    return result;
  });
}

module.exports = {
  getSocialData: getSocialData,
}
