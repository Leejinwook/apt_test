const express = require('express');
const router = express.Router();
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const mysql = require('mysql');
require('dotenv').config();
const bodyParser = require('body-parser');
const { route } = require('..');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');

const connection = mysql.createConnection({
  host : process.env.DB_HOST,
  user : process.env.DB_USER,
  password : process.env.DB_PASS,
  port : process.env.DB_PORT,
  database : process.env.DB_NAME
});
connection.connect();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}));

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('login.ejs', {'message':''});
  //res.send('respond with a resource');
});

router.get('/login', function(req, res, next) {
  console.log("get login url");
  let msg;
  const errMsg = req.flash('error');
  if(errMsg) msg = errMsg;
  res.render('login.ejs', {'message':msg});
});

router.get('/login_ajax', function(req, res, next) {
  console.log("get login url");
  let msg;
  const errMsg = req.flash('error');
  if(errMsg) msg = errMsg;
  res.render('login_ajax.ejs', {'message':msg});
});

router.get('/join', function(req, res, next) {
    console.log("get join")
    let msg;
    const errMsg = req.flash('error');
    if(errMsg) msg = errMsg;
    res.render('join.ejs', {'message': msg});
    //msg = ""
});

// -------------------------------------------------

passport.serializeUser(function(user, done){
  console.log(user);
  console.log('passport session save: ', user.id);
  done(null, user.id);
});

passport.deserializeUser(function(id, done){
  console.log('passport session get id: ', id);
  done(null, id);
});

// --------------------------------
// member join
passport.use('local-join', new localStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, function(req, email, password, done){
  // Authentication call back
  // check exist email
  const sql = "SELECT email FROM user WHERE email = ?";
  const values = [email];
  connection.query(sql, values, function(err, result, field){
    if(err) return done(err);
    if(result.length){
      console.log("email exist!!")
      return done(null, false, {message: 'Your email is already used.'});
    }else{
      const carnumber = req.body.carnumber;
      // check carnumber
      const sql = "SELECT carnumber FROM user WHERE carnumber = ?";
      const values = [carnumber];
      connection.query(sql, values, function(err, result, field){
        if(err) return done(err);
        if(result.length){
          console.log('carnumber exist!');
          return done(null, false, {message: 'Your car is already registered.'});
        }else{
          // create user
          console.log('create user info');
          console.log(carnumber);
          const carid = uuid.v4();
          const sql = "INSERT INTO user (email, password, carnumber, carid) values (?,?,?,?)";
          const values = [email, password, carnumber, carid];
          connection.query(sql, values, function(err, result, field){
            if(err) throw err;
            return done(null, {'email' : email, 'id': result.insertId, 'carnumber': carnumber, 'carid': carid});
          })
        }
      })
    }
  })
}));

router.post('/join', passport.authenticate('local-join',{
  successRedirect: '/',
  failureRedirect: '/user/join',
  failureFlash: true
}));

router.post('/join_app', function(req, res, next){
  const email = req.body.email;
  const carnumber = req.body.carnumber;
  const password = req.body.password;
  const sql = "SELECT email FROM user WHERE email = ?";
  const values = [email];
  connection.query(sql, values, function(err, result, field){
    if(err) return done(err);
    if(result.length){
      console.log("email exist!!");
      return res.json({'status': false, 'message':'Your email is already used.'});
    }else{
      
      // check carnumber
      const sql = "SELECT carnumber FROM user WHERE carnumber = ?";
      const values = [carnumber];
      connection.query(sql, values, function(err, result, field){
        if(err) return done(err);
        if(result.length){
          console.log('carnumber exist!');
          return res.json({'status': false, 'message':'The car number is already registered.'});
        }else{
          // create user
          console.log('create user info');
          console.log(carnumber);
          const carid = uuid.v4();
          const sql = "INSERT INTO user (email, password, carnumber, carid) values (?,?,?,?)";
          const values = [email, password, carnumber, carid];
          connection.query(sql, values, function(err, result, field){
            if(err) throw err;
            return res.json({'status': true, "message": "Regist Done. Please Login!", 'email' : email, 'id': result.insertId, 'carnumber': carnumber, 'carid': carid});
          })
        }
      })
    }
  })
})

// --------------------------------
// memger login
passport.use('local-login', new localStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, function(req, email, password, done){
  console.log(req.body.type);
  console.log(email);
  console.log(password);
  // Authentication call back
  const sql = "SELECT id, email, carnumber FROM user WHERE email = ? and password = ?";
  const values = [email, password];
  connection.query(sql, values, function(err, result, field){
    if(err) return done(err);
    if(result.length){
      console.log('login success!!');
      console.log(result[0].email);
      console.log(result[0].carnumber)
      return done(null, {'email' : result[0].email, 'id': result[0].id, 'carnumber': result[0].carnumber});
    }else{
      console.log('login fail!!')
      return done(null, false, {message: 'your login information is incorrect.'})
    }
  }); 
}));

router.post('/login', passport.authenticate('local-login',{
  successRedirect: '/',
  failureRedirect: '/user/login',
  failureFlash: true
}));

router.post('/login_ajax', function(req, res, next){
  passport.authenticate('local-login', function(err, user, info){
    if(err) res.status(500).json(err);
    if(!user) return res.status(401).json(info.message);

    req.logIn(user, function(err){
      if (err) return next(err);

      const token = jwt.sign(
        {id: user.id, email: user.email, auth: user.auth}, process.env.JWT_SECRET
      )
      return res.json({ token }); 
    });
  })(req, res, next);
})

router.get('/logout', function(req, res, next){
  console.log("call logout!")
  req.logout(function(err){
    if (err) return next(err);
    res.redirect('/user/login')
  });
});

module.exports = router;
