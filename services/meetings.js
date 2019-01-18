const db = require('../middleware/database');
const _ = require('lodash');
const q = require('q');

module.exports = {
    saveMeeting,
    getMeetings
}

function saveMeeting(user, body) {
    let meeting_object = {
        user_id: user.id,
        agenda: body.agenda,
        location: body.location,
        type: body.type,
        created: Date.now() / 1000,
        time: body.time
    }
    if (body.client_attendees) {
        meeting_object.client_attendees = JSON.stringify(body.client_attendees);
    }
    let attendees = body.attendees;
    return db('meetings').insert(meeting_object).then(function(data) {
        let meeting_id = data[0];
        let insert_attendees = [];
        _.each(attendees, function (attendee, index) {
            insert_attendees[index] = _saveAttendee(meeting_id, user.id, attendee);
        });
        return q.all(insert_attendees);
    });
}

function getMeetings(user) {
    return db('meetings').innerJoin('attendees', 'attendees.meeting_id', 'meetings.id')
    .innerJoin('users', 'users.id', 'attendees.attendee_id')
    .select(['meetings.id', 'meetings.client_attendees as client_attendees', 'meetings.type as type', 'meetings.location as location', 'meetings.agenda as agenda', 'meetings.time as time', 'meetings.enabled as enabled', 'users.name as name', 'users.email as email', 'users.id as user_id'])
    .where('user_id', user.id).andWhere('meetings.enabled', 1).then(function(data) {
        let meetings_data = [];
        data.forEach(function(obj) {
            if (!this[obj.id]) {
                this[obj.id] = {
                    id: obj.id,
                    type: obj.type,
                    location: obj.location,
                    agenda: obj.agenda,
                    time: obj.time,
                    client_attendees: JSON.parse(obj.client_attendees),
                    enabled: obj.enabled,
                    users: []
                };
                meetings_data.push(this[obj.id]);
            }
            this[obj.id].users.push({name: obj.name, email: obj.email, user_id: obj.user_id});
        }, Object.create(null));
        return meetings_data;
    });
}

function _saveAttendee(meeting_id, user_id, attendee_id) {
    db('attendees').insert({
        created: Date.now() / 1000,
        meeting_id: meeting_id,
        organiser_id: user_id,
        attendee_id: attendee_id
    }).then();
}