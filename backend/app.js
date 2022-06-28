var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cors = require('cors');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var session = require('express-session');
var flash = require('connect-flash')

var app = express();

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const options = {
 definition: {
   openapi: '3.0.0',
   info: {
     title: 'Hello World',
     version: '1.0.0',
   },
},
 apis: ['./routes/*.js'], // files containing annotations as above
};

const openapiSpec = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));

app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

// login session
app.use(session({
  secret: 'lgcnsredteam',
  resave: false,
  saveUninitialized: true
}))

//passport
app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

app.use('/', require('./routes/index'));
app.use('/user', require('./routes/user/user'));
app.use('/api', require('./routes/api'));
app.use('/car', require('./routes/car/car'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
