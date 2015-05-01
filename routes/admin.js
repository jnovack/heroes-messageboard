var express = require('express');
var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.get('/end-of-match', function(req, res, next) {
    res.render('end-of-match-admin.jade', { esl: true, title: 'End-Of-Match Admin'} );
});

router.get('/messageboard', function(req, res, next) {
    res.render('messageboard-admin.jade', { title: 'Messageboard Admin'});
});

module.exports = router;