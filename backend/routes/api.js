const express = require('express');
const router = express.Router();

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
});
module.exports = router;