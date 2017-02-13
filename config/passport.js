var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../db/users.js');

module.exports = function(){
    passport.serializeUser(function(user , done){
        done(null , user.id);
    });
    
	passport.deserializeUser(function(id , done){
		User.findById(id , function(err , user){
            done(err , user);
        })
	});

    // ===========================
	// LOCAL
	// ===========================
	passport.use("local-signup" , new LocalStrategy({
		usernameField : "inputEmail",
		passwordField : "inputPwValid1",
		passReqToCallback : true
	} , function(req , email , password , done){
		
		process.nextTick(function(){

			// 패스워드 Valid체크 
			var body = req.body;
			
			// 1. EMAIL // PASSWORD // PASSWORD2 존재 유무
			if(!body.inputEmail || body.inputEmail.trim() == ""){
				console.log("VALID!!")
				return done(null, false , req.flash('signupMessage' , "이메일을 입력해주세요"));
			}
			else if(!body.inputPwValid1 || body.inputPwValid1.trim() =="" || !body.inputPwValid2 || body.inputPwValid2.trim() == "")
			{
				console.log("VALID!!")
				return done(null, false , req.flash('signupMessage' , "패스워드를 입력해주세요"));
			}
			else{ console.log("PASSED"); }

			// 2. 패스워드 일치 여부
			if(body.inputPwValid1.trim() != body.inputPwValid2){
				return done(null , false, req.flash('signupMessage' , '패스워드가 일치하지 않습니다'));
			}

			User.findOne({ "LOCAL.EMAIL" : email } , function(err , user){
				if(err){
					console.log("DB CRASHED !!!" , err); 
					return done(err); 
				}

				if(user){ return done(null , false , req.flash("signupMessage" , "이 이메일은 이미 사용중입니다")); }
				else{
					var newbie = new User();

					if(!newbie.validEmail(email))
					{
						return done(null , false, req.flash('signupMessage' , '이메일 형식이 올바르지 않습니다'));
					}
					else if(!newbie.secureCheck(password))
					{
						return done(null , false , req.flash('signupMessage' , "패스워드 형식이 올바르지 않습니다"));
					}

					newbie.LOCAL.EMAIL = email;
					newbie.LOCAL.PASSWORD = newbie.generateHash(password);
					newbie.INFO.EMAIL = email;


					newbie.save(function(err){
						if(err){ throw err; }

						console.log("ACCOUNT CREATED!!");
						return done(null , newbie);
					});
				}
			});

			
		});
	}));
	
	passport.use("local-signin" , new LocalStrategy({
		usernameField : "inputEmail",
		passwordField : "inputPw",
		passReqToCallback : true
	} , function(req , email , password , done){
		
		User.findOne({ "LOCAL.EMAIL" : email } , function(err , user){
			if(err){ 
                console.log("ERR INVOLVED!!");
                console.log(err);
                return done(err); 
            }
			if(!user){ 
                return done(null , false , req.flash( "signinMessage" ,  "잘못되거나 없는 이메일입니다")); }
			if(!user.validPassword(password)){
				return done(null , false , req.flash( "signinMessage" , "패스워드가 잘못됐습니다" ));
			}
            
			return done(null , user);
		});
		
	}));
	
}