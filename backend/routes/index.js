var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  console.log('main page is loaded', req.user);
  const id = req.user
  res.render('index.ejs', {'id': id});
});

module.exports = router;
