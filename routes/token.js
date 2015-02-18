var express = require('express');
var router  = express.Router();
var moment  = require('moment')

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database: 'kalorimerkezi3'
});

connection.connect();


/**
	
	token kontrolü yapar
*/
var secure = function(req, res, next) {
	connection.query('SELECT * from tokens where token = ?', [req.headers.token], function(err, result) {
  		if (result.length === 0) {
  			res.status(401).send({
  				"status" 	: "error",
  				"message"	: "not_authorized"
  			});
  		} else {
  			req.user_id = result[0].user_id;
			next();
  		}
	});
}

/*
	Post 
	mail ve şifreyle giriş yapılmasını sağlar
	mail ve şifre bulunması durumunda token random token üretir
	@post user.mail
	@post user.password
*/
router.post('/login', function(req, res){
	var mail 	 = req.body.mail;
	var password = req.body.password;
	connection.query('select * from kullanici where mail = ? and password = ?',[mail,password], function(err, user) {
		
		if(user.length === 0) {
			res.status(404).send({
  				"result" 	: "error",
  				"data"		: "user_not_found"
  			});
		} else {
			var token = require('rand-token').uid(16);
			connection.query('insert into tokens (user_id, token) values (?, ?)',[user[0].k_id, token], function(err, result) {
				res.json({
					"result" : "success",
					"data"   : token
				});
			});
		}
	});		
});



/*
	Get
	Çıkış yapar.
*/
router.get('/logout', function(req, res){
	connection.query('delete from tokens where token = ?',[req.headers.token], function(err, user) {
		res.status(200).send();
	});

});

module.exports = router;
