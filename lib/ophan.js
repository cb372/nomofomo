var request = require('request');

var getMostReadArticles = function(cb) {
  request('http://api.ophan.co.uk/api/mostread?api-key=cb372', function(error, response, body) {
    cb(error, body); 
  });
}


module.exports = {

  getMostReadArticles: getMostReadArticles

}
