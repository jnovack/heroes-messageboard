module.exports = function(myApp){
    var debug = require('debug')('module:webserver');
    var session = require('express-session');
    var sessionStore = require('connect-memcached')(session);
    var webserver = {
            widgets: [],
            configurations: [],
            pages: [],
            pageData: [],
            io: {}
        },
        passport = require('passport'),
        express = require('express'),
        jade = require("jade");

    webserver.initialize = function(){

        var app = express();
        app.use(express.static(__dirname + '/public'));         // set the static files location /public/js will be /js for users

        var logger = require('morgan');
        app.use(logger('dev'));                                 // log every request to the console

        var cookieParser = require('cookie-parser');
        var bodyParser = require('body-parser');
        var flash = require('connect-flash');

        app.use(session({
                secret: "keyboard-cat",
                resave: true,
                saveUninitialized: true,
                store: new sessionStore({
                    hosts: ['192.168.99.100:32768']
                })
        }));
        app.use(bodyParser.urlencoded({ extended: true }));     // parse application/x-www-form-urlencoded
        app.use(bodyParser.json());                             // parse application/json
        app.use(cookieParser('banana hammock'));
        app.use(flash());                                       // use connect-flash for flash messages stored in session

        var favicon = require('serve-favicon');
        app.use(favicon(__dirname + '/public/favicon.ico'));

        app.set('view engine', 'jade');
        app.set('views', __dirname + '/views');

        app.use(function(req, res, next){
            // Allow the jade templates access to myApp
            res.locals.myApp = myApp;
            next();
        });

        // Have to load this before app.router, otherwise, you cannot properly use passport middleware.
        passport.serializeUser(function(user, done) {
            done(null, user);
        });
        passport.deserializeUser(function(user, done) {
            done(null, user);
        });
        app.use(passport.initialize());
        app.use(passport.session());


        // Load other functions so Jade can use them
        app.locals.moment = require("moment");


        // Authentification
        var twitchStrategy = require("passport-twitch").Strategy;
        passport.use(new twitchStrategy({
                clientID: myApp.config.TWITCH_CLIENT_ID,
                clientSecret: myApp.config.TWITCH_SECRET,
                callbackURL: myApp.config.TWITCH_CALLBACK,
                scope: "user_read"
            },
            function(accessToken, refreshToken, profile, done) {
                return done(null, profile);
            }
        ));
        app.get("/auth/twitch", passport.authenticate("twitch"));
        app.get("/auth/twitch/callback", passport.authenticate("twitch", { failureRedirect: "/" }), function(req, res) {
        /*  req.session.passport
        {
            user: {
                provider: 'twitch',
                id: 15661192,
                username: 'ticklemeozmo',
                displayName: 'TickleMeOzmo',
                email: 'ticklemeozmo@gmail.com',
                _raw: '{"display_name":"TickleMeOzmo","_id":15661192,"name":"ticklemeozmo","type":"user","bio":"At best, I\'m an average video game player.  At worst, I\'m a liability to any team game.","created_at":"2010-09-16T18:07:24Z","updated_at":"2016-04-18T20:55:20Z","logo":"https://static-cdn.jtvnw.net/jtv_user_pictures/ticklemeozmo-profile_image-413c54cf592c0b05-300x300.png","_links":{"self":"https://api.twitch.tv/kraken/users/ticklemeozmo"},"email":"ticklemeozmo@gmail.com","partnered":false,"notifications":{"push":true,"email":true}}',
                _json: {
                    display_name: 'TickleMeOzmo',
                    _id: 15661192,
                    name: 'ticklemeozmo',
                    type: 'user',
                    bio: 'At best, I\'m an average video game player.  At worst, I\'m a liability to any team game.',
                    created_at: '2010-09-16T18:07:24Z',
                    updated_at: '2016-04-18T20:55:20Z',
                    logo: 'https://static-cdn.jtvnw.net/jtv_user_pictures/ticklemeozmo-profile_image-413c54cf592c0b05-300x300.png',
                    _links: {
                        self: 'https://api.twitch.tv/kraken/users/ticklemeozmo'
                    },
                    email: 'ticklemeozmo@gmail.com',
                    partnered: false,
                    notifications: {
                        push: true,
                        email: true
                    }
                }
            }
        }
        */
            res.redirect(req.session.forward);
        });

        // Router
        routes = require("./routes/")(app, myApp, express);

        // app.use extender for static bower content
        cdn = require("./routes/cdn.js")(app, myApp, express);

        // app.use('/users', users);
        // app.use('/admin', admin);
        app.use('/', routes);

        // catch 404 and forward to error handler
        app.use(function(req, res, next) {
            var err = new Error('Not Found');
            err.status = 404;
            next(err);
        });

        // error handlers

        // development error handler
        // will print stacktrace
        if (app.get('env') === 'development') {
            app.use(function(err, req, res, next) {
                res.status(err.status || 500);
                res.render('error', {
                    message: err.message,
                    error: err
                });
            });
        }

        // production error handler
        // no stacktraces leaked to user
        app.use(function(err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: {}
            });
        });

        var server = app.listen(myApp.config.PORT);
        debug("webserver started on port " + myApp.config.PORT);
        webserver.io = require('socket.io').listen(server);
        debug("socket.io started on port " + myApp.config.PORT);
        webserver.app = app;

    };


    function onAuthorizeSuccess(data, accept){
        console.log('successful connection to socket.io');

        // The accept-callback still allows us to decide whether to
        // accept the connection or not.
        accept(null, true);

        // OR

        // If you use socket.io@1.X the callback looks different
        accept();
    }

    function onAuthorizeFail(data, message, error, accept){
        console.log('failed connection to socket.io:', message);

        // If you use socket.io@1.X the callback looks different
        // If you don't want to accept the connection
        if(error)
            accept(new Error(message));
        // this error will be sent to the user as a special error-package
        // see: http://socket.io/docs/client-api/#socket > error-object
    }


    myApp.webserver = webserver;
    debug("loaded...");
};
