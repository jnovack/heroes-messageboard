module.exports = function(app, myApp, express){

    var router = express.Router();

    var authentificate = function(req, res, next) {
        if (req && req.session && req.session.passport && req.session.passport.user && req.session.passport.user.username &&
            myApp.config.TWITCH_ALLOWED.indexOf(req.session.passport.user.username) > -1 )
        {
            next();
        } else {
            req.session.forward = req.url;
            res.redirect("/auth/twitch");
        }
    };

    router.get('/', function(req, res, next) {
        res.render('index.jade', { version: myApp.package.version, showmodal: req.flash('showmodal')} );
    });

    router.get('/modal', function(req, res, next) {
        req.flash('showmodal', true);
        res.redirect('/' );
    });

    router.get('/messageboard', function(req, res, next) {
        res.render('messageboard.jade', { title: "Heroes of the Storm - Message Board" } );
    });

    router.get('/messageboard/admin', authentificate, function(req, res, next) {
        res.render('messageboard-admin.jade', { admin: true, title: 'Messageboard Admin'});
    });

    return router;
};