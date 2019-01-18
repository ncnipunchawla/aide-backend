const express = require('express');
const router = express.Router();
const db = require('../middleware/database');
const clients = require('../services/clients');

router.post('/v1/clients', function(req, res) {
    clients.createClient({
        'title': req.body.title,
        'email_domain': req.body.email_domain,
        'subscription_start_date': req.body.subscription_start_date || 0,
        'subscription_end_date': req.body.subscription_end_date || 0
    }).then(function(result){
        res.status(result.status).json(result.message);
    })
});

router.get('/v1/clients', function(req, res) {
    var selectFields = [
        'clients.title as title', 
        'clients.id as id', 
        'clients.status as status',
        'clients.created as created', 
        'clients.email_domain as email_domain',
        'clients.subscription_start_date as subscription_start_date',
        'clients.subscription_end_date as subscription_end_date'
    ];
    db("clients").select(selectFields)
    .orderBy('clients.title', 'asc').then(function(clients){
        res.json(clients);
    })
})

module.exports = router;