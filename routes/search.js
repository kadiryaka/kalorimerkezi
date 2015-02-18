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
	GET
	Bütün besinleri listeler
*/
router.get('/food', secure, function(req, res) {
	connection.query('SELECT * from besin where kalori > -1', function(err, food) {
	  if (err) throw err;
	  res.json(food);
});
});

/*  
	GET
	aranılan sorguya göre, besinlerden en düşük kaloriye sahip ilk 10 tanesini getirir.
	@param 		  : key
	@requestParam : user_id
*/
router.get('/food/:key', secure, function(req, res) {
	var key = [req.params.key];
	connection.query("SELECT * from besin where ad like ? order by kalori limit 0,10",'%' + key + '%', function(err, result) {
	//add log
	connection.query("Insert into log (mail, isim) values ((select mail from kullanici where k_id = ?), ?)",[req.user_id, key]);
  	if (err) throw err;
  	res.json(result);
});
});

/*  
	GET
	aranılan sorguya göre ve sayfa sayısına göre gerekli 10 tanesini getirir.
	@param : key
	@param : page_number
	@requestParam : user_id
*/
router.get('/food/:key/:page', secure, function(req, res) {
	var pageNumber = req.params.page;
	var startLimit = (pageNumber-1)*10;
	var contentCount = 10;
	connection.query("SELECT * from besin where ad like ? order by kalori limit ?,?",['%' + [req.params.key] + '%', startLimit, contentCount], function(err, key) {
  		if (err) throw err;
  		res.json(key);
});
});




module.exports = router;
