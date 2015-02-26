var express = require('express');
var router = express.Router();
var ophan = require('../lib/ophan.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  ophan.getMostReadArticles(function(error, data) {
    res.render('index', { title: 'Express', articles: data });
  });
});

module.exports = router;
