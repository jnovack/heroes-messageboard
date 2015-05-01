var express = require('express');
var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.get('/messageboard', function(req, res, next) {
    res.sendFile(req.app.get('publicDir') + '/messageboard.html');
});

router.get('/end-of-match', function(req, res, next) {
    res.render('end-of-match.jade', { esl: true } );
});

module.exports = router;
