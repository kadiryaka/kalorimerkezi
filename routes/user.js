var express = require('express');
var router = express.Router();

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
          "status"  : "error",
          "message" : "not_authorized"
        });
      } else {
        req.user_id = result[0].user_id;
      next();
      }
  });
}

/*  
  GET
  kullanıcı profilini getirir.
  @requestParams    : user_id
*/
router.get('/information', secure, function(req, res) {
connection.query('SELECT * from kullanici where k_id = ?',[req.user_id], function(err, user) {
  if (err) throw err;
  res.json(user);
});
});

/*  
  GET
  ölçüler ekranındaki ilk açılışta çalıştırılması lazım
  burada kullanıcının o ana kadar giriş yapılmış tarihleri ve en son girilmiş ölçüleri getirilir
  @requestParams    : user_id
*/ 
router.get('/information/datesAndSize', secure, function(req, res) {
  connection.query('SELECT tarih from olculer where k_id = ? order by tarih desc',[req.user_id], function(err, tarihler) {
    connection.query('SELECT * from olculer where k_id = ? and tarih = ?',[req.user_id, tarihler[0].tarih], function(err, size) {
      if (err) throw err;
      res.json({
        "tarihler" : tarihler,
        "size"     : size
         });
    });
  });
});

/*  
  GET
  istenilen tarihe göre kullanıcı ölçülerini getirir
  @params           : tarih Açıklama tarih formatı YYYY-AA-GG şeklinde olmalıdır. örn : 2015-02-18
  @requestParams    : user_id
*/
router.get('/information/size/:tarih', secure, function(req, res) {
connection.query('SELECT * from olculer where k_id = ? and tarih = ?',[req.user_id, req.params.tarih], function(err, size) {
  if (err) throw err;
  res.json(size);
});
});



module.exports = router;
