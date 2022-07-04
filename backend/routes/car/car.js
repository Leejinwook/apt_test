const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const connection = mysql.createConnection({
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    password : process.env.DB_PASS,
    port : process.env.DB_PORT,
    database : process.env.DB_NAME
});
connection.connect();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}));

router.get('/update', function (req, res, next) {
    console.log('Get Request...')
    const name = req.query.name || 'World';
    res.json({ message: `Hello ${name}` });
});

// Collect car status
router.post('/update', function(req, res, next){
    console.log(req.body);
    const carid = req.body.carid;
    const carnumber = req.body.carnumber;
    const speed = req.body.speed;
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;

    const sql = 'INSERT INTO car_info (carid, carnumber, speed, latitude, longitude) values (?,?,?,?,?)';
    const values = [carid, carnumber, speed, latitude, longitude];
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
    //const carid = '09e7b07a-eeb6-11ec-acf2-acde48001122';
    //select
    var sql = 'SELECT carid, carnumber, speed, latitude, longitude FROM car_info WHERE carid =?';
    var values = [carid];
    connection.query(sql, values, function(err, result, field){
        if(err){
            console.log(err);
            res.json({'status':'ERROR'})
        }else{
            if (result && result.length > 0){
                console.log(result.length);
                res.render('carinfo.ejs', {
                    'carid': result[0].carid,
                    'carnumber': result[0].carnumber,
                    'title': result[0].title
                });
            }else{
                res.render('carinfo.ejs', {
                    'carid': '',
                    'carnumber': '',
                    'title': ''
                });
            }
        }
    });
});

router.post('/enginStatusReq', function(req, res, next){
    console.log(req.body);
    const engin = ['STOP', 'START', 'STOP_REQ', 'START_REQ']
    const carid = req.body.carid;
    const type = req.body.type; //car or app
    const engin_status = req.body.engin_status.toUpperCase();
    var req_ok = false;
    // 요청 정합성 확인
    engin.includes(engin_status)? req_ok = true: req_ok=false;

    // 현재 상태와 요청상태 비교
    if(req_ok){
        var sql = 'SELECT engin_status FROM car_engin WHERE carid = ? order by id desc limit 1;'
        var value = [carid];
        var cur_engin_status = '';
        connection.query(sql, value, function(err, result, field){
            if(err){
                console.log(err);
                res.json({'status':'DB ERROR'});
            }else{
                console.log(result);
                if (result && result.length > 0){
                    cur_engin_status = result[0].engin_status;
                }else{
                    cur_engin_status = '';
                }
            }
            console.log('cur_engin_status : ' + cur_engin_status)
            console.log('engin_status : ' + engin_status)
            console.log('type :' + type)
            if(type == 'CAR'){
                if(cur_engin_status == '' || cur_engin_status.replace('_REQ', '') == engin_status.replace('_REQ', '')){
                    if(engin.includes(engin_status)){
                        var sql = 'INSERT INTO car_engin (carid, engin_status) values (?,?)';
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
                    }else{
                        res.json({'status':'DB ERROR'})
                    }
                }else{
                    res.json({'status':'REQUEST STATUS ERROR(SAME)'})
                }
            }else if(type == 'APP'){
                if(cur_engin_status == '' || cur_engin_status.replace('_REQ', '') != engin_status.replace('_REQ', '')){
                    if(engin.includes(engin_status)){
                        var sql = 'INSERT INTO car_engin (carid, engin_status) values (?,?)';
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
                    }else{
                        res.json({'status':'DB ERROR'})
                    }
                }else{
                    res.json({'status':'REQUEST STATUS ERROR(SAME)'})
                }
            }
        });
    }
});

// 엔진 현재상태 조회
router.post('/enginStatus', function(req, res, next){
    console.log(req.body);
    const carid = req.body.carid;

    var sql = 'SELECT engin_status FROM car_engin WHERE carid = ? order by id desc limit 1'
    var value = [carid];
    var cur_engin_status = '';
    connection.query(sql, value, function(err, result, field){
        if(err){
            console.log(err);
            res.json({'status':'DB ERROR'});
        }else{
            console.log(result);
            if (result && result.length > 0){
                res.json({'status': result[0].engin_status});
            }else{
                res.json({'status':'NO_DATA'});
            }
        }
    });
});

// -----------------------------------
// APP Functions
// 차량정보 조회 조회
router.post('/info', function(req, res, next){
    console.log(req.body);
    const token = req.body.token;
    let email = '';
    try{
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        if(payload){
            email = payload.email;
            var sql = 'select carnumber, carid from user where email = ?';
            var value = [email];
            connection.query(sql, value, function(err, result, field){
                if(err){
                    console.log(err);
                    res.json({'status': false,'message':'Error!!'});
                }else{
                    console.log(result);
                    if (result && result.length > 0){
                        res.json({'status': true, 'message': 'ok', 'data': {'carnumber': result[0].carnumber, 'carid': result[0].carid}});
                    }else{
                        res.json({'status': false,'message':'The car info is not exist.'});
                    }
                }
            });
        }
    }catch(e){
        console.log(e)
    }
    
});
 
// 엔진 현재상태 조회
router.post('/engin', function(req, res, next){
    // console.log(req.body);
    const token = req.body.token;
    // jwt verify
    try{
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        if(payload){
            const sql = 'SELECT engin_status, carid FROM car_engin WHERE carid = (SELECT carid FROM user WHERE email = ?) ORDER BY id DESC LIMIT 1';
            const value = [payload.email];
            connection.query(sql, value, function(err, result, field){
                if(err){
                    console.log(err);
                    res.json({'status': false, 'message':'DB ERROR'});
                }else{
                    if (result && result.length > 0){
                        res.json({
                            'status': true,
                            'message':'ok',
                            'data':{
                                'engin_status': result[0].engin_status,
                                'carid': result[0].carid
                            }
                        });
                    }else{
                        res.json({'status':false, 'message': 'The engin status is not exist.'});
                    }
                }
            });

        }
    }catch(e){
        console.log(e);
        res.json({'status': false,'message':'Invalid token.'});
    }

});

// 차량정보 상태 조회
router.post('/history', function(req, res, next){
    const token = req.body.token;
    let email = '';
    try{
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        if(payload){
            email = payload.email;
            var sql = 'SELECT id, carid, carnumber, speed, door, latitude, longitude, time FROM car_info WHERE carid = (SELECT carid FROM user WHERE email = ?) ORDER BY id DESC LIMIT 30';
            var value = [email];
            connection.query(sql, value, function(err, result, field){
                if(err){
                    console.log(err);
                    res.json({'status': false,'message':'Error!!'});
                }else{
                    console.log(result);
                    if (result && result.length > 0){
                        res.json({'status': true, 'message': 'ok', 'data': result});
                    }else{
                        res.json({'status': false,'message':'The car info is not exist.'});
                    }
                }
            });
        }
    }catch(e){
        console.log(e)
    }
    
});

router.post('/changeEngin', function(req, res, next){
    console.log(req.body);
    const engin = ['STOP', 'START', 'STOP_REQ', 'START_REQ'];
    const engin_status = req.body.reqStatus.toUpperCase();
    const isValid = engin.includes(engin_status)? true: false;
    console.log("111")
    if (!isValid) res.json({'status': false,'message':'Invalide Engin Status Requested.'});
    else {
        const token = req.body.token;
        // jwt verify
        try{
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            if(payload){
                const sql = 'SELECT engin_status, carid FROM car_engin WHERE carid = (SELECT carid FROM user WHERE email = ?) ORDER BY id DESC LIMIT 1';
                const value = [payload.email];
                connection.query(sql, value, function(err, result, field){
                    if(err){
                        console.log(err);
                        res.json({'status': false, 'message':'DB ERROR'});
                    }else{
                        if (result && result.length > 0){
                            const status = result[0].engin_status;
                            if(status == req.body.reqStatus) res.json({'status': false,'message':'Same Status'});
                            else{
                                const sql = 'INSERT INTO car_engin (carid, engin_status) values (?,?)';
                                const values = [result[0].carid, req.body.reqStatus];
                                connection.query(sql, values, function(err, result, field){
                                    if(err){
                                        console.log(err);
                                        res.json({'status': false, 'message':'DB ERROR'});
                                    }else{
                                        console.log(result);
                                        res.json({
                                            'status': true,
                                            'message':'ok'
                                        });
                                    }
                                });
                            }
                        }else{
                            res.json({'status':false, 'message': 'The car info is not exist.'});
                        }
                    }
                });

            }
        }catch(e){
            console.log(e);
            res.json({'status': false,'message':'Invalid token.'});
        }
    }
});

module.exports = router;