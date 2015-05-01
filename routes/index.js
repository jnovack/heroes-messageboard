var express = require('express');
var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });


//TODO - /messageboard
router.get('/', function(req, res, next) {
    res.sendFile('index.html', { root: publicDir });
});

router.get('/end-of-match', function(req, res, next) {
    res.render('end-of-match.jade', { esl: true } );
});

module.exports = router;
