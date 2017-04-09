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
var mailer = require('./helpers/mailer');
var passwordmailer = require('./helpers/passwordmailer');
var csrfProtection = csrf();
/* GET users listing. */

//Handel CSRF Errors
router.use(function (err, req, res, next) {
  if (err.code !== 'EBADCSRFTOKEN') return next(err)
  // handle CSRF token errors here
  console.log('form tampered with')
})

//route for signup page
router.get('/signup', csrfProtection,(req, res, next) => {
  var errorMessage = req.flash('errormessage')
  res.render('signup',{title: 'TaskManager | Sign Up', 
                        csrfToken: req.csrfToken(), 
                        messages: errorMessage, 
                        hasError: errorMessage.length > 0 })
});
//route for logiin page
router.get('/login', csrfProtection,(req, res, next) => {
  var errorMessage = req.flash('errormessage');
  var Activatedinfo = req.flash('successmessage');
  res.render('login',{title: 'User Profile',
                      csrfToken: req.csrfToken(),
                      messages: errorMessage,
                      active : Activatedinfo, 
                      hasError: errorMessage.length > 0 })
});

//called when user signs up
router.post('/signup',csrfProtection,passport.authenticate('local-signup',{	
  successRedirect : '/user/signupSuccess',
	failureRedirect : '/user/signup',
  session: false
}));

//called when user logs in
router.post('/login',csrfProtection,passport.authenticate('local-login',{	
  successRedirect : '/user/success',
	failureRedirect : '/user/login',
}));

router.get('/signupSuccess',csrfProtection, ( req, res, next) => {
  req.flash('successmessage', "Activation Email has been sent to your email. Please activate it to complete registration")
  res.redirect('/user/login');
})

router.post('/activate', (req,res,next) => {
  
  User.findOne({'token': req.body.token}, (err,user)=>{
    if(err){
      console.log(err)
    } else if(!user){
      req.flash('errormessage','Toke has expired');
      res.redirect('/user/login');
    } else {
      var token = req.body.token;
      jwt.verify(token,databaseConfig.secret,(err,decode)=>{
        if(err){
          req.flash('errormessage','Toke has expired');
          res.redirect('/user/login');
        } else {
          user.token= "activated";
          user.active = true;
          user.save((err)=>{
            if(err){
              console.log(err);
            }
            req.flash('successmessage', user.firstName+" your account has been activated")
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



router.get('/changePassword/:token',csrfProtection,(req,res, next) => {
    var successmessage = req.flash('successmessage');
    var errormessages  = req.flash('errormessage');
    User.findOne({'resetpwdtoken':req.params.token},(err, user)=>{
    if(err){
        console.log(err);
    } else if(!user){
        req.flash('errormessage',"Token has expired!!");
        res.redirect('/user/resetPassword');
    } else {
        jwt.verify(req.params.token,databaseConfig.secret,(err,decode)=>{
            if(err){
                req.flash('errormessage',"Token has expired!!");
                res.redirect('/user/resetPassword');
            } else{
                res.render('changePassword',{title: 'Reset Password | Sign Up', 
                                            csrfToken: req.csrfToken(),
                                            successmessage:successmessage,
                                            errormessages: errormessages,
                                            userEmail : user.email 
                                            });
            }
        })
    }
  })  
})


router.post('/changePassword',csrfProtection,(req,res, next) => {
  User.findOne({'email':req.body.email},(err,user)=>{
      if(err){
        console.log(err);
      } else {
        user.password   = user.hashPassword(req.body.password);
        user.resetpwdtoken ="";
        user.save((err)=>{
          if(err){
            cosole.log(err);
          } else {
            req.flash('successmessage',"Password reset success....");
            res.redirect('/user/login')
          }
        })
      }
  })
})


router.get('/resetPassword',csrfProtection,(req,res, next) => {
  var successmessage = req.flash('successmessage');
  var errormessages  = req.flash('errormessage');
  res.render('resetPasswordMail',{title: 'Reset Password | Sign Up', 
                        csrfToken: req.csrfToken(),
                        successmessage:successmessage,
                        errormessages: errormessages, 
                        });
})

router.post('/resetPassword',csrfProtection,(req,res, next) => {
  User.findOne({'email':req.body.email},(err, user)=>{
    if(err){
      console.log(err);
    } else if(!user){
      req.flash('errormessage',"This email id is not registered!!");
      res.redirect('/user/resetPassword');
    } else if(!user.active){
      req.flash('errormessage',"This account is not yet verified!!");
      res.redirect('/user/resetPassword');      
    } else {

       user.resetpwdtoken  = jwt.sign({firstName:user.firstName,email: user.email}, 
                                      databaseConfig.secret,
                                      { expiresIn: '1d' });

      user.save((err)=>{
        if(err){
              console.log(err);
        }

      })                          
      passwordmailer(user.email, user.firstName, user.resetpwdtoken);
      req.flash('successmessage',"Mail sent. Please check your inbox.");
      res.redirect('/user/resetPassword');
    }
  })  
})


router.get('/resendVerificationMail',csrfProtection,(req,res, next) => {
  var successmessage = req.flash('successmessage');
  var errorMessage  = req.flash('errormessage');
  res.render('resendVerificationMail',{title: 'Resend Mail | Sign Up', 
                        csrfToken: req.csrfToken(),
                        successmessage:successmessage,
                        errormessages: errorMessage, 
                        hasError: errorMessage.length > 0 });
})

router.post('/resendVerificationMail',csrfProtection,(req,res,next)=>{
  User.findOne({'email':req.body.email},(err, user)=>{
    if(err){
      console.log(err);
    } else if(!user){
      req.flash('errormessage',"This email id is not registered!!");
      res.redirect('/user/resendVerificationMail');
    } else if(user.active){
      req.flash('errormessage',"This account is already Verified!!");
      res.redirect('/user/resendVerificationMail');      
    } else {

       user.token  = jwt.sign({firstName:user.firstName,email: user.email}, 
                                      databaseConfig.secret,
                                      { expiresIn: '1d' });

      user.save((err)=>{
        if(err){
              console.log(err);
        }

      })                          
      mailer(user.email, user.firstName, user.token);
      req.flash('successmessage',"Mail sent. Please check your inbox to complete registration.");
      res.redirect('/user/resendVerificationMail');
    }
  })  
})
module.exports = router;
