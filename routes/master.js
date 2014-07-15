/**
 * Created by vasiliy.lomanov on 14.07.2014.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.render('master', { title: 'RTCdemo' , isSlave: false});
});

module.exports = router;
