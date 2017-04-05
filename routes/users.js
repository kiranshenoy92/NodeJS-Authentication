var express = require('express');
var csrf = require('csurf')
var router = express.Router();
var passport = require('passport');

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
  res.render('login',{title: 'User Profile',csrfToken: req.csrfToken()})
});

//called when user signs up
router.post('/signup',passport.authenticate('local-signup',{	
  successRedirect : '/',
	failureRedirect : '/user/signup',
}));

//called when user logs in
router.post('/login',passport.authenticate('local-login',{	
  successRedirect : '/user/success',
	failureRedirect : '/user/login',
}));

router.get('/success', isLoggedIn, (req,res,next) => {
  if(req.session.redirectTo){
    var redirectPath = req.session.redirectTo;
    delete req.session.redirectTo;
    res.redirect(redirectPath);
  } else {
    res.redirect('/');
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
