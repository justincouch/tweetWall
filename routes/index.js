var express = require('express');
var router  = express.Router();
//var fs    = require( 'fs' );

/* GET home page. */
router.get('/', function(req, res) {
  console.log('routing');
  res.render('index', { title: 'U Tweet Wall' });
});

module.exports = router;