const db = require('../middleware/database');
const jwt = require('jsonwebtoken');
const q = require('q');
const users = require('./users');

module.exports = {
    generateToken
}
let JWT_ALGO = "HS512"
let JWT_CLIENT_AUDIENCE = "localhost:5500"
let JWT_CLIENT_SECRET = "aide-backend"
function generateToken(id, name, email, client_id) {
    let promise = q.defer();

    let payload = {
        id: id,
        email: email,
        name: name,
        client_id: client_id
    };

    let options = {
        expiresIn: '1y',
        audience: JWT_CLIENT_AUDIENCE,
        algorithm: JWT_ALGO
    };

    jwt.sign(payload, new Buffer(JWT_CLIENT_SECRET, 'base64'), options, function (err, token) {
        promise.resolve(token);
    })

    return promise.promise;
}