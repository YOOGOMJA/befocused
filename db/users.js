var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = new mongoose.Schema({
  "LOCAL" : {
		"EMAIL"				: String,
		"PASSWORD"			: String
	},
	"FACEBOOK" : {
		"ID" 				: String,
		"TOKEN"				: String,
		"EMAIL"				: String
	},
	"INFO" : {
		"EMAIL" 			: String,
		"NAME" : {
			"FIRST" 		: String,
			"LAST"			: String
		},
		"PROFILE_IMG"		: String,
		"PROFILE_IMG_COV" 	: String,
		"TEAM" :{
			"ID" : String,
			"NAME" : String
		}
	},
	"ACC_NO"				: Number,
	"CREATE_DT"				: { type :	Date , default : Date.now },
	"MODIFIED_DT"			: { type :	Date , default : Date.now },
	"MODIFIED_ACC_NO"		: String
});

userSchema.methods.generateHash = function(password){
	return bcrypt.hashSync(password , bcrypt.genSaltSync(8) , null);
}

userSchema.methods.validPassword = function(password){
	return bcrypt.compareSync(password , this.LOCAL.PASSWORD);
}

userSchema.methods.validEmail = function(email){
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	if(!email) return false;
	else
	{
		return re.test(email);
	}
}

// 패스워드 조약
// 숫자 특수문자 영문자 포함
// 길이가 10자 이상 20자 이하
userSchema.methods.secureCheck = function(password) {
	if(!password){ return false; }
	else{ password.trim(); }
	
	if(password.length < 10 || password.length > 20){
		return false;
	}
	
	var has = {
		literal : false,
		num : false,
		special : false,
		kor : false
	};
	var reg = {
		num : /[0-9]/,
		eng : /[a-zA-z]/,
		kor : /[ㄱ-ㅋ가-힣]/,
		spe : /[`~!@#$%^&*()_+-=;:',<.>?]/
	};
	
	for(idx in password){
		if(has.kor) { break; }
		
		if(!isNaN(idx)){
			if(!has.literal) has.literal = reg.eng.test(password.charAt(idx));
			if(!has.num) has.num = reg.num.test(password.charAt(idx));
			if(!has.special) has.special = reg.spe.test(password.charAt(idx));
			if(!has.kor) has.kor = reg.kor.test(password.charAt(idx));
		}
	}
	
	if(has.literal && has.num && has.special && !has.kor){
		return true;
	}
	else{
		return false;
	}
}

module.exports = mongoose.model('users', userSchema, 'users');