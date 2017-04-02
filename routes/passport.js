var LocalStrategy   = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');
var passport = require('passport');
var mongoose = require('mongoose');

var User = require('../models/user');
var toUpperFisrtChar = require('./helpers/Upper');

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
                return done(null,false,req.flash('info', "Email is already registered!!"));
            } else {
                console.log(req.body);
                var firstName  = toUpperFisrtChar(req.body.firstName.toLowerCase());
                var lastName   =  toUpperFisrtChar(req.body.lastName.toLowerCase());
                var employeeID = req.body.employeeID;


                var newUser = new User();
                newUser.firstName  = firstName;
                newUser.lastName   = lastName;
                newUser.password   = newUser.hashPassword(password);
                newUser.email      = email;
                newUser.employeeID = employeeID;
                
                newUser.save((err)=>{
                    if(err){
                        console.log(err);
                    }
                    return done(null,newUser);
                })
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
                return done(null,false)
            }
            if(user.comparePassword(password)){
                return done(null,false);
            }
            return done(null,user);
        })    
    }
));