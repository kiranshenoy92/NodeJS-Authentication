var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphandelbars = require('express-handlebars');
var mongoose  = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var databaseConfig = require('./config/database');
var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

mongoose.connect(databaseConfig.database);
mongoose.Promise = require('bluebird');
mongoose.connection.on ('error',(err) => {
  console.log("some error occured while connecting to the database");
})
mongoose.connection.on ('open',() => {
  console.log("successfully connected to the database");
})

// view engine setup
app.engine('.hbs', exphandelbars({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', '.hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret:'mysecret',
  resave: false, 
  saveUninitialized: false,
  rolling: true,
  cookie: {
    path: '/',
    httpOnly: true,
    secure: false,
    maxAge : 1000000 ,
    signed: false
  }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));

require('./routes/passport');
app.use('/', routes);
app.use('/user', users);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
