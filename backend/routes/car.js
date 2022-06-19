const express = require('express');
const router = express.Router();
const mysql = require('mysql');
require('dotenv').config();

const connection = mysql.createConnection({
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    password : process.env.DB_PASS,
    port : process.env.DB_PORT,
    database : process.env.DB_NAME
});

connection.connect();

var bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}));

router.get('/info', function (req, res, next) {
    console.log("Get Request...")
    const name = req.query.name || 'World';
    res.json({ message: `Hello ${name}` });
});

// Collect car status
router.post('/info', function(req, res, next){
    console.log(req.body);
    const carid = req.body.carid;
    const carnumber = req.body.carnumber;
    const speed = req.body.speed;
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;

    var sql = "INSERT INTO car_info (carid, carnumber, speed, latitude, longitude) values (?,?,?,?,?)";
    var values = [carid, carnumber, speed, latitude, longitude];
    connection.query(sql, values, function(err, result, field){
        if(err){
            console.log(err);
            res.json({'status':'ERROR'})
        }else{
            console.log(result);
            res.json({'status':'OK'});
        }
    });
});

router.get('/history', function(req, res, next){
    const carid = req.query.carid
    //const carid = "09e7b07a-eeb6-11ec-acf2-acde48001122";
    //select
    var sql = "SELECT carid, carnumber, speed, latitude, longitude FROM car_info WHERE carid =?";
    var values = [carid];
    connection.query(sql, values, function(err, result, field){
        if(err){
            console.log(err);
            res.json({'status':'ERROR'})
        }else{
            if (result && result.length > 0){
                console.log(result.length);
                //res.json({'status':'OK'});
                res.render("carinfo.ejs", {
                    'carid': "",
                    'carnumber': "",
                    'title': ""
                });
            }else{
                res.render("carinfo.ejs", {
                    'carid': "",
                    'carnumber': "",
                    'title': ""
                });
            }
        }
    });
});

module.exports = router;