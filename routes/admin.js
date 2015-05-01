var express = require('express');
var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// router.get('/', function(req, res, next) {
//     res.sendFile('index.html', { root: publicDir });
// });

router.get('/end-of-match', function(req, res, next) {
    res.render('end-of-match-admin.jade', { esl: true } );
});

router.get('/messageboard', function(req, res, next) {
    res.render('admin', { title: 'Admin Interface'});
});

module.exports = router;