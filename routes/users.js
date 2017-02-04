var express = require('express');
var router = express.Router();
var passport = require('passport');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
  res.render("./users/signin" , { title : "SIGN IN" });
});

router.get('/signup' , function(req,res,next){
  
  res.render('./users/signup' , { title : "SIGN UP"  , message : req.flash('signupMessage') });
});


router.get('/signin' , function(req,res,next){
  console.log(req.flash('sign'))
  res.render('./users/signin' , { title : "SIGN IN" , message : req.flash('signinMessage') });
});

router.post("/signin", passport.authenticate("local-signin" , {
  successRedirect : "/users/profile",
  failureRedirect : "/users/signin",
  failureFlash : true
}));

router.post("/signup",  passport.authenticate("local-signup" , {
  successRedirect : "/users/profile",
  failureRedirect : "/users/signup",
  failureFlash : true
	}));
	

module.exports = router;
