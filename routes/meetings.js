const express = require('express');
const router = express.Router();
const db = require('../middleware/database');
const meetings = require('../services/meetings');

router.post('/v1/meetings', function(req, res) {
    let body = req.body;
    let user = req.user;
    meetings.saveMeeting(user, body).then(function(data) {
        res.status(200).send('CREATED');
    }).catch(function(err) {
        res.status(400).send(err);
    });
});

router.get('/v1/meetings', function(req, res) {
    meetings.getMeetings(req.user).then(function(data) {
        res.status(200).send(data);
    }).catch(function(err) {
        res.status(400).send(err);
    });
});

router.patch('/v1/meetings/:id', function(req, res) {
    let body = req.body;
    let user = req.user;
    let update_object = {};
    if (body.hasOwnProperty('agenda')) {
        update_object.agenda = body.agenda;
    }
    if (body.hasOwnProperty('location')) {
        update_object.location = body.location;
    }
    if (body.hasOwnProperty('type')) {
        update_object.type = body.type;
    }
    if (body.hasOwnProperty('attendees')) {
        update_object.attendees = body.attendees;
    }
    if (body.hasOwnProperty('client_attendees')) {
        update_object.client_attendees = body.client_attendees;
    }
    if (body.hasOwnProperty('time')) {
        update_object.time = body.time;
    }
    if (body.hasOwnProperty('enabled')) {
        update_object.enabled = body.enabled;
    }
    db('meetings').update(update_object).where('id', req.params.id).then(function() {
        res.status(200).send('UPDATED');
    });
});

module.exports = router;