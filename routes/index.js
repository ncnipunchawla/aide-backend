const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
  res.status(200).send('pong');
});

router.get('/ping', function (req, res) {
  res.status(200).send('pong');
});

router.get('/v1/ping', function (req, res) {
  res.status(200).send('pong');
});

module.exports = router;