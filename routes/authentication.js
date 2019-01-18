const express = require('express');
const users = require('../services/users');
const router = express.Router();

router.post('/v1/authenticate', function (req, res) {
    users.handleAuthentication(req.body.email, req.body.password).then(function(result){
        res.status(result.status).json(result.data);
    });
});

module.exports = router;
