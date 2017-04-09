var LocalStrategy   = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');
var passport = require('passport');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');
var xoauth2 = require('xoauth2');
var databaseConfig = require('../config/database');

var User = require('../models/user');
var toUpperFisrtChar = require('./helpers/Upper');
var mailer = require('./helpers/mailer');
// Passport needs to be able to serialize and deserialize users to support persistent login sessions
passport.serializeUser(function(user, done) {
    console.log('serializing user:',user.email);
    return done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id,function(err,user){
        console.log('deserializing user:',user.email);
        done(err,user);
    })
});

passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {
        User.findOne({'email' : email},function(err,user){
            if(err){
                return done(err);
            }
            if(user){
                return done(null,false,req.flash('errormessage', "Email is already registered!!"));
            } else {
                
                var firstName  = toUpperFisrtChar(req.body.firstName.toLowerCase());
                var lastName   =  toUpperFisrtChar(req.body.lastName.toLowerCase());
                var employeeID = req.body.employeeID;
                
                var error = '';
                if(firstName == ''){
                    error = error + 'First Name';
                }
                if(lastName ==''){
                    if(error !=''){
                        error = error + ',';
                    }
                    error =  error + 'Last Name';
                }
                if(employeeID ==''){
                    if(error !=''){
                        error = error + ',';
                    }
                    error = error + 'Employee ID';
                }
                if(email ==''){
                    if(error !=''){
                        error = error + ',';
                    }
                    error =  error + 'Email';
                }
                if(password ==''){
                    if(error !=''){
                        error = error + ',';
                    }
                    error = error + 'Password';
                }
                if(error!=''){
                    error = error +' is required!!'
                    return done(null,false,req.flash('errormessage', error));
                }else{
                    var newUser = new User();
                    newUser.firstName  = firstName;
                    newUser.lastName   = lastName;
                    newUser.password   = newUser.hashPassword(password);
                    newUser.email      = email;
                    newUser.employeeID = employeeID;
                    newUser.token      = jwt.sign(
                                            {
                                            firstName:newUser.firstName,
                                            email: newUser.email
                                            }, 
                                            databaseConfig.secret,
                                            { expiresIn: '1d' });
                   

                    newUser.save((err)=>{
                        if(err){
                            console.log(err);
                        }
                        mailer(newUser.email, newUser.firstName, newUser.token, req.csrfToken());
                        return done(null,newUser);
                    })
                }
            }
        })
    })
);

passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback : true
    },
    function(req, email, password, done) {
        console.log(req.body);
        User.findOne({'email':email},function(err,user){
            if(err){
                return done(err);
            }
            if(!user){
                return done(null,false,req.flash('errormessage', "No user found"))
            }
            if(!user.comparePassword(password)){
                return done(null,false,req.flash('errormessage', "Wrong password!!"));
            }
            if(!user.active){
                return done(null,false,req.flash('errormessage', "Account has not been activated. Please verify your emailid from the mail sent!!"));
            }
            return done(null,user);
        })    
    }
));