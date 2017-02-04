var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();


// ===============
// MONGOOSE SET UP
// ===============
var mongoose = require("mongoose");
var mongo_uri = require("mongodb-uri");

mongoose.connect(mongo_uri.formatMongoose("mongodb://master:rhawk1202@ds139899.mlab.com:39899/heroku_38ctzwl1") , function(err){
  if(err)
  { 
    console.log('DB CONNECT PROCESS GOT PROBLEM !! '); 
    console.log("message : [" + err + "]");
  }
  else 
  {
    console.log("DB CONNECTED!!");
  }
});

// ## session
var session = require('express-session');
// ================
// PASSPORT 
// ================
var passport = require('passport');
var flash = require('connect-flash');
var passport_config = require('./config/passport');
app.use(session({
  secret : "GOMJA-FOCUSED-SECRET",
  saveUninitialized : true
}));
passport_config();
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ================
// bower path setup
// ================
app.use('/bower' , express.static(path.join(__dirname , "/bower_components")));

// router setup !! 
app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
