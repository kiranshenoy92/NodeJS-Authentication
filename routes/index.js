var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Kiran',isLoggedIn: req.isAuthenticated() });
});
router.get('/contact', (req, res, next) => {
  res.render('contact', { title: 'Contact Us',isLoggedIn: req.isAuthenticated() });
});
router.get('/about', (req, res, next) => {
  res.render('about', { title: 'About Us',isLoggedIn: req.isAuthenticated() });
});

module.exports = router;
