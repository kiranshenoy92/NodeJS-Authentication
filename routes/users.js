var express = require('express');
var csrf = require('csurf')
var router = express.Router();
var passport = require('passport');
var jwt = require('jsonwebtoken');
var databaseConfig = require('../config/database');

//database models
var User = require('../models/user');

//helpers
var toUpperFisrtChar = require('./helpers/Upper');
var isLoggedIn = require('./helpers/isLoggedIn');

var csrfProtection = csrf();
/* GET users listing. */
router.use(csrfProtection);

//Handel CSRF Errors
router.use(function (err, req, res, next) {
  if (err.code !== 'EBADCSRFTOKEN') return next(err)
  // handle CSRF token errors here
  console.log('form tampered with')
})

//route for signup page
router.get('/signup', (req, res, next) => {
  var errorMessage = req.flash('info')
  res.render('signup',{title: 'TaskManager | Sign Up', 
                        csrfToken: req.csrfToken(), 
                        messages: errorMessage, 
                        hasError: errorMessage.length > 0 })
});
//route for logiin page
router.get('/login', (req, res, next) => {
  var errorMessage = req.flash('info');
  var Activatedinfo = req.flash('Activatedinfo');
  res.render('login',{title: 'User Profile',
                      csrfToken: req.csrfToken(),
                      messages: errorMessage,
                      active : Activatedinfo, 
                      hasError: errorMessage.length > 0 })
});

//called when user signs up
router.post('/signup',passport.authenticate('local-signup',{	
  successRedirect : '/user/signupSuccess',
	failureRedirect : '/user/signup',
}));

//called when user logs in
router.post('/login',passport.authenticate('local-login',{	
  successRedirect : '/user/success',
	failureRedirect : '/user/login',
}));

router.get('/signupSuccess', ( req, res, next) => {
  req.flash('Activatedinfo', "Activation Email has been sent to your email. Please activate it to complete registration")
  res.redirect('/user/login');
})

router.post('/activate', (req,res,next) => {
  
  User.findOne({'token': req.body.token}, (err,user)=>{
    if(err){
      console.log(err)
    } else {
      var token = req.body.token;
      console.log("TOKEN="+token);
      jwt.verify(token,databaseConfig.secret,(err,decode)=>{
        if(err){
          console.log(err);
        } else {
          user.token= "activated";
          user.active = true;

          user.save((err)=>{
            if(err){
              console.log(err);
            }
            req.flash('Activatedinfo', user.firstName+" your account has been activated")
            res.redirect('/user/login');
          })
        }
      })
    }
  })
})

router.get('/success', isLoggedIn, (req,res,next) => {
  if(req.session.redirectTo){
    var redirectPath = req.session.redirectTo;
    delete req.session.redirectTo;
    res.redirect(redirectPath);
  } else {
    res.redirect('/user/profile');
  }
})





//route to display user profile 
//displays only if user is logged in
router.get('/profile',isLoggedIn, (req, res, next) => {
  res.render('userProfile',{title: 'User Profile',use: req.user,isLoggedIn: req.isAuthenticated()})
});



router.get('/logout',isLoggedIn,(req,res, next) => {
	req.logout();
	res.redirect('/')
});

module.exports = router;
