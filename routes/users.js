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
  res.render('login',{title: 'User Profile',csrfToken: req.csrfToken(),isLoggedIn: req.isAuthenticated()})
});

//called when user signs up
router.post('/signup',passport.authenticate('local-signup',{	
  successRedirect : '/',
	failureRedirect : '/user/signup',
}));

//called when user logs in
router.post('/login',passport.authenticate('local-login',{	
  successRedirect : '/user/profile',
	failureRedirect : '/user/login',
}));

//route to display user profile 
//displays only if user is logged in
router.get('/profile',isLoggedIn, (req, res, next) => {
  res.render('userProfile',{title: 'User Profile',use: req.user,isLoggedIn: req.isAuthenticated()})
});



router.get('/logout',isLoggedIn,(req,res, next) => {
	req.logout();
	console.log("user logged out")
	res.redirect('/')
});

/*
router.post('/signup', (req, res, next) => {
  //reading data into variables
  var firstName  = toUpperFisrtChar(req.body.firstName.toLowerCase());
  var lastName   =  toUpperFisrtChar(req.body.lastName.toLowerCase());
  var employeeID = req.body.employeeID;
  var email      = req.body.email;
  var password   = req.body.password;
  var error = '';
  if(firstName == '') {
    error = error + 'First Name';
  }
  if(lastName == ''){
    if(error!=''){
      error = error + ',';
    }
    error = error + 'Last Name';
  } 
  if(employeeID == ''){
    if(error!=''){
      error = error + ',';
    }
    error = error + 'Employee ID';
  }
  if(email == ''){
    if(error!=''){
      error = error + ',';
    }
    error = error + 'Email';
  }
  if(password == ''){
    if(error!=''){
      error = error + ',';
    }
    error = error + 'Password';
  }
  if(error!=''){
    error = error + " is required!!"
    req.flash('info', error)
    res.redirect('/user/signup');
  } 
  else {
    var user = new User();
      user.firstName  = firstName;
      user.lastName   = lastName;
      user.password   = user.hashPassword(password);
      user.email      = email;
      user.employeeID = employeeID;

    user.save((err)=>{
      if(err){
        console.log(err);
      }
    })
    console.log("here")
    res.redirect('/')
  }
});*/


module.exports = router;
