var express = require('express');
var q = require('q');
var router = express.Router();
var ophan = require('../lib/ophan.js');
var capi = require('../lib/capi.js');
var timeline = require('../lib/timeline.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  timeline.getTimeline()
  .then(function(articles) {
    res.json(articles);
  })
  .catch(function(err) {
    res.render('error', { 
      message: err.message,
      error: err 
    });
  })
});

module.exports = router;
