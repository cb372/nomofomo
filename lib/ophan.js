var httpclient = require('./httpclient');

var getMostReadArticles = function() {
  return httpclient('http://api.ophan.co.uk/api/mostread?api-key=cb372');
}

module.exports = {

  getMostReadArticles: getMostReadArticles

}
