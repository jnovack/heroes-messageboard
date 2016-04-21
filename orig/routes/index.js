var express = require('express');
var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.get('/messageboard', function(req, res, next) {
    res.render('messageboard.jade', { title: "Heroes of the Storm - Message Board" } );
});

router.get('/end-of-match', function(req, res, next) {
    res.render('end-of-match.jade', { } );
});

module.exports = router;
