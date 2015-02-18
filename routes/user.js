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


module.exports = router;
