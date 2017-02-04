var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
  res.render("./users/signin" , { title : "SIGN IN" });
});

router.get('/signup' , function(req,res,next){
  res.render('./users/signup' , { title : "SIGN UP" });
})

router.get('/signin' , function(req,res,next){
  res.render('./users/signin' , { title : "SIGN IN" });
})

module.exports = router;
