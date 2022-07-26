const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const rs_secret = "-----BEGIN RSA PRIVATE KEY-----\n"
+ "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\n"
+ "-----END RSA PRIVATE KEY-----"

const pub_key = "-----BEGIN PUBLIC KEY-----\n" +
"MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAsH4OIkr/DeCHEiimF3Av\n" +
"Q7flNFb9i5lv2u0byGZ061rR0G5F9DOT8bpS/Ubcci2h9eGiTrjf7WukGhhcTYDW\n" +
"mELGnVyFANjxy2j7sBGKp7YVCAy5wx+BwB16ir5hLPHc6+W3H/IPoUWDQ9jHT9RZ\n" +
"JJagoIRgo3i/hQU/p4PFIuNfqPtONjSc9Xffl/cjHsnclMIrcnnlaR1UGROdfg2Z\n" +
"QO+7OST292iTmYvVHy2PRghaYo32F1CTd0bmp41/KLv9i0SkD6L8npPZDr3Dt/ee\n" +
"mApuMiT47oSgMSG4bFJaM8XY8idoBtbvVO/ZV3zMBfNz25lm6PcR7lYUvMlGktBo\n" +
"dNOWgj6JfEwvZgBl7gBbPZ1piJb9bKIaB6PjeZn8l+2fuZCdOcSpgoAaUs62ocSw\n" +
"mQZUV6MzthR6U7U979RAag84NYPe6fqfcqk9iW5qHr1a/E0s/FMNHSTVHGAYrTXm\n" +
"olgdqArVpcx1WR2SKi5I839+BamzsnoJItKqbY00h8li74yUCPJPzk5ysmHRRUTG\n" +
"5yL/LCF85WIhokv15tT04+U4KOboQ+xHVJgIbWgAf9PG8XfjtsdST8iyB38gvNj4\n" +
"OlJqJ8/U3+lDOKXh5U2/e9dsmMlMIGWj5hqq+SzOavklWNtUZGaH9N2Av/TI5XfM\n" +
"zFm5LYCUSSnR/d+L2sJHGT0CAwEAAQ==\n" + 
"-----END PUBLIC KEY-----";


/**
* @openapi
* /api/hello:
*   get:
*     description: Welcome to swagger-jsdoc!
*     parameters:
*       - name: name
*         in: query
*         required: false
*         schema:
*           type: string
*     responses:
*       200:
*         description: Returns a mysterious string.
* /api/hi:
*   post:
*     description: Welcome to swagger-jsdoc!
*     parameters:
*       - name: name
*         in: Post
*         required: false
*         schema:
*           type: json
*     responses:
*       200:
*         description: Returns a mysterious string.
*/
router.get('/hello', function (req, res, next) {
  const name = req.query.name || 'World';
  res.json({ message: `Hello ${name}` });
});

router.post('/hi', function (req, res, next) {
  console.log(req.body);
  const name = req.body.name || 'World';
  res.json({ message: `Hello ${name}` });
})


router.get('/get_jwt_hs256', function(req, res, next){
  const secret = "magic" 
  option = {
      algorithm : "HS256",
      expiresIn : "3h",
      issuer : "LG CNS"
  }
  const token = jwt.sign(
    {role: "student", message1: "find my secret!", message2: "and change role to admin"}, secret, option
  )
  res.json({ jwt: token });
})

router.get('/get_jwt_rs256', function(req, res, next){
  const option = {
      algorithm : "RS256",
      expiresIn : "3h",
      issuer : "LG CNS"
  }
  const token = jwt.sign(
    {role: "student", message: "Change algorithem to hs256", message2: "and change role to admin"}, rs_secret, option
  )
  res.json({ jwt :token, pub_key: pub_key });
})

router.post('/verify_jwt_hs256', function(req, res, next){
  console.log(req.body);
  const token = req.body.jwt;
  const secret = "magic";
  
  try{
    const payload = jwt.verify(token, secret);
    if(payload){
      const role = payload.role
      res.json({verify: "SUCCESS", role: role})
    }else{
      res.status(406).json({verify: "FAIL"})
    }
  }catch(e){
    res.status(406).json({verify: "FAIL"})
    //console.log(e)
  }
});

router.post('/verify_jwt_rs256', function(req, res, next){
  console.log(req.body);
  const token = req.body.jwt;
 
  try{
    const payload = jwt.verify(token, pub_key);
    if(payload){
      const role = payload.role
      res.json({verify: "SUCCESS", role: role})
    }else{
      res.status(406).json({verify: "FAIL"})
    }
  }catch(e){
    try{
      console.log("aaaaa")
      const payload = jwt.verify(token, pub_key, { algorithms: ['HS256'] });
      if(payload){
        const role = payload.role
        res.json({verify: "SUCCESS", role: role})
      }
    }catch(e){
      console.log(e)
      res.status(406).json({verify: "FAIL"})
    }
  }
});

module.exports = router;