const express = require('express');
const router = express.Router();
/**
* @openapi
* /car/info:
*   get:
*     description: get car information
*     parameters:
*       - name: name
*         in: query
*         required: false
*         schema:
*           type: string
*     responses:
*       200:
*         description: Returns a mysterious string.
*/
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
    // save to db
    //res.send("your speed is " + speed);
    /*res.send({
        'carid': carid,
        'carnumber': carnumber,
        'speed': speed,
        'latitude': latitude,
        'longitude': longitude
      });*/

})

router.get('/show', function(req, res, next){
    const title = "Your Car Info"
    const carnumber = "12가3456"
    const carid = "09e7b07a-eeb6-11ec-acf2-acde48001122";
    res.render("carinfo.ejs", {
        'carid': carid,
         'carnumber':carnumber,
          'title': title
        })
})
module.exports = router;