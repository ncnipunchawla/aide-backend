const express = require('express');
const router = express.Router();
const db = require('../middleware/database');

router.get('/v1/users', function(req, res) {
    db('users').select(['*']).where('client_id', req.user.client_id).then(function(data) {
        res.status(200).send(data);
    });
});

module.exports = router;