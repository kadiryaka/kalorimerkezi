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
	Get 
	bugünün besin kayıtlarını ve besin girişi yapılmış tarihleri getirir.
*/
router.get('/getRecordsAndDate', secure, function(req, res){
	var date = moment().format('YYYY-MM-DD');
				connection.query('select * from kayitlar where k_id = ? and tarih = ?',[req.user_id, date], function(err, records) {
					connection.query("select tarih from kayitlar where k_id = ? group by tarih",[req.user_id], function(err, dateList) {
						res.json({"records" : records, "dateList" : dateList});
					});
				});

});

/*
	GET
	İstenen tarihe özel besin kayıtlarını getirir,
	@param 			    : mail
	@param  			: date,    		açıklama : tarih formatı : YYYY-AA-GG örn : 2015-02-13
	@requestParams 		: user id
*/
router.get('/getrecord/:date', secure, function(req, res) {	
	connection.query('SELECT besin_id, besin.ad, besin.kalori, kayitlar.miktar, kayitlar.id FROM besin,kayitlar WHERE kayitlar.k_id = ? and kayitlar.tarih = ? and besin.besin_id=kayitlar.b_id', [req.user_id,req.params.date], function(err, records) {
		//total calori is calculating..
		var totalCalories = 0;
		if (records.length > 0) {
			for (var i=0; i<records.length; i++) {
				if (records[i].kalori != null && records[i].kalori > 0) {
					totalCalories = totalCalories + records[i].kalori*records[i].miktar;
				}
			}
		}
	  	res.json({"totalCalories" : totalCalories, "records" : records});
	});
});

/*  
	GET
	Kullanıcının  eklediği besini kaydeder
	@param   	   : time  	Açıklama : time formatı bugün  için = 0, dün için = 1
	@param         : foodId 	
	@param 	       : quantity
	@requestParams : user_id
*/

router.get('/save/food/:time/:foodId/:quantity', secure, function(req, res) {
	if (req.params.time == 0) {
		var date = moment().format('YYYY-MM-DD');
	} else if (req.params.time == 1) {
		var date = moment().subtract(1, 'days').format('YYYY-MM-DD');
	}	
	connection.query("Insert into kayitlar (k_id, b_id, tarih, miktar) values (?,?,?,?)",[req.user_id, req.params.foodId, date, req.params.quantity], function(err) {
  		if (err) throw err;
 		res.status(200).send();
});
});

/*  
	GET
	Kullanıcının besin kaydını siler
	@param         : recordId
*/

router.get('/delete/food/:foodId', secure, function(req, res) {
	connection.query("DELETE FROM kayitlar where id = ? and k_id = ?",[req.params.foodId, req.user_id], function(err) {
  		if (err) throw err;
  		res.json();
});
});

/*  
	GET 
	kullanıcının besin eklenmiş tarihlerini getirir. 
	@requestParams : user_id
*/

router.get('/dateList', secure, function(req, res) {
	connection.query("select tarih from kayitlar where k_id = ? group by tarih",[req.user_id], function(err, result) {
  	if (err) throw err;
  	res.json(result);
});
});



module.exports = router;
