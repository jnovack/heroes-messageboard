var express = require('express');
var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.get('/end-of-match', function(req, res, next) {
    res.render('end-of-match-admin.jade', { admin: true, title: 'End-Of-Match Admin'} );
});

router.get('/messageboard', function(req, res, next) {
    if (req.session.passport && req.session.passport.user && req.session.passport.user.username &&
        process.env.TWITCH_ALLOWED.indexOf(req.session.passport.user.username) > -1 )
    {
        res.render('messageboard-admin.jade', { admin: true, title: 'Messageboard Admin'});
    } else {
        req.session.forward = "/admin/messageboard";
        res.redirect("/auth/twitch");
    }
});

module.exports = router;