var httpclient = require('./httpclient');

var getSocialData = function(urls) {
  return httpclient('http://api.facebook.com/restserver.php?method=links.getStats&format=json&urls=' + urls.join())
  .then(function(response) {
    console.log(response);
    var result = {};
    response.forEach(function(item) {
      result[item.url] = item;
    });
    console.log(result);
    return result;
  });
}

module.exports = {
  getSocialData: getSocialData,
}
