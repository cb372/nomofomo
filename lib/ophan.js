var httpclient = require('./httpclient');

var getMostReadArticles = function() {
  return httpclient('http://api.ophan.co.uk/api/mostread?age=604800&api-key=cb372');
}

var getViewCount = function(path) {
  return httpclient('http://api.ophan.co.uk/api/mostread?path=/' + path + '&age=604800&api-key=cb372')
    .then(function(ophanResults) {
      if (ophanResults.length < 1) {
        return 0;
      } else {
        return ophanResults[0].count;
      }
    });
}

module.exports = {

  getMostReadArticles: getMostReadArticles,
  getViewCount: getViewCount

}
