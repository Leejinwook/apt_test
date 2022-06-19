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
                res.render("carinfo.ejs", {
                    'carid': result[0].carid,
                    'carnumber': result[0].carnumber,
                    'title': result[0].title
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

router.post('/enginStatusReq', function(req, res, next){
    console.log(req.body);
    const engin = ["STOP", "START", "STOP_REQ", "START_REQ"]
    const carid = req.body.carid;
    const engin_status = req.body.engin_status.toUpperCase();
    var req_ok = false;
    // 요청 정합성 확인
    engin.includes(engin_status)? req_ok = true: req_ok=false;

    // 현재 상태와 요청상태 비교
    if(req_ok){
        var sql = "SELECT engin_status FROM car_engin WHERE carid = ? order by id desc limit 1;"
        var value = [carid];
        var cur_engin_status = "";
        connection.query(sql, value, function(err, result, field){
            if(err){
                console.log(err);
                res.json({'status':'DB ERROR'});
            }else{
                console.log(result);
                if (result && result.length > 0){
                    cur_engin_status = result[0].engin_status;
                }else{
                    cur_engin_status = "";
                }
            }

            if(cur_engin_status == "" || cur_engin_status.replace('_REQ', '') != engin_status.replace('_REQ', '')){
                if(engin.includes(engin_status)){
                    var sql = "INSERT INTO car_engin (carid, engin_status) values (?,?)";
                    var values = [carid, engin_status];
                    connection.query(sql, values, function(err, result, field){
                        if(err){
                            console.log(err);
                            res.json({'status':'DB ERROR'});
                        }else{
                            console.log(result);
                            res.json({'status': engin_status});
                        }
                    });
                    // To-Do : 자동차(라즈베리파이)로 엔진시작 요청 구현
                }else{
                    res.json({'status':'DB ERROR'})
                }
            }else{
                res.json({'status':'REQUEST STATUS ERROR(SAME)'})
            }
        });
    }
});

// 엔진 현재상태 조회
router.post('/enginStatus', function(req, res, next){
    console.log(req.body);
    const carid = req.body.carid;

    var sql = "SELECT engin_status FROM car_engin WHERE carid = ? order by id desc limit 1;"
    var value = [carid];
    var cur_engin_status = "";
    connection.query(sql, value, function(err, result, field){
        if(err){
            console.log(err);
            res.json({'status':'DB ERROR'});
        }else{
            console.log(result);
            if (result && result.length > 0){
                res.json({'status': result[0].engin_status});
            }else{
                res.json({'status':'Engin Stop'});
            }
        }
    });
});

module.exports = router;