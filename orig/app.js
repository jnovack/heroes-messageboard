var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session');
var twitchStrategy = require("passport-twitch").Strategy;


var routes = require('./routes/index');
var users = require('./routes/users');
var admin = require('./routes/admin');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('publicDir', path.join(__dirname, 'public'));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: 'cookie monster', resave: true, saveUninitialized: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());


passport.use(new twitchStrategy({
        clientID: process.env.TWITCH_CLIENT_ID,
        clientSecret: process.env.TWITCH_SECRET,
        callbackURL: "https://heroes-messageboard.ngrok.io/auth/twitch/callback",
        scope: "user_read"
    },
    function(accessToken, refreshToken, profile, done) {
        return done(null, profile);
    }
));

app.use('/users', users);
app.use('/admin', admin);
app.use('/', routes);


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


module.exports = app;
