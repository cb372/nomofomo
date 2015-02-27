var express = require('express');
var q = require('q');
var router = express.Router();
var ophan = require('../lib/ophan.js');
var capi = require('../lib/capi.js');
var timeline = require('../lib/timeline.js');

router.get('/timeline.json', function(req, res, next) {
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

router.get('/timeline-isis.json', function(req, res, next) {
  timeline.getIsisTimeline(req.query.from, req.query.to)
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
