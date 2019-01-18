const db = require('../middleware/database');
const q = require('q');
const _ = require('lodash');
const authenticate = require('./authentication');

module.exports = {
    handleAuthentication
}

function getUserDetails(email) {
    return db('users').where('email', email)
        .select([
            'users.id as id',
            'users.enabled as enabled',
            'users.created as created',
            'users.email as email',
            'users.name as name',
            'users.role as role',
            'users.client_id as client_id'])
        .then(function (data) {
            return data;
        })
}

function handleAuthentication(email, password) {
    return db("users").select("users.password").where("email", email).then(function (user) {
        if(!user.length)
        {
            return {
                'status': 401,
                'data': 'Incorrect email and password combination. Please try again.'
            }
        }
        return authenticateUser(email, password).then(function (data) {
            if (!data) {
                return {
                    'status': 401,
                    'data': 'Incorrect email and password combination. Please try again.'
                }
            }
            return getUserDetails(email).then(function (user_data) {
                //Check if account exists. If it does, construct JWT and send to client
                if (user_data.length) {
                    user_data = user_data[0];
                    if (user_data.enabled != '1') {
                        return {
                            'status': 401,
                            'data': 'Your account has been disabled.'
                        };
                    }
                    return authenticate.generateToken(user_data.id, user_data.name, user_data.email, user_data.client_id).then(function (token) {
                        return {
                            'status': 200,
                            'data': {
                                'profile': user_data,
                                'token': token
                            }
                        }
                    });
                    //If not, send error message
                } else {
                    return {
                        'status': 401,
                        'data': 'You do not have permissions to access Amber yet'
                    }
                }
            })
        }).catch(function (err) {
            return {
                'status': 401,
                'data': 'Incorrect email and password combination. Please try again.'
            }
        })
    });
}

function authenticateUser(email, password) {
    // let salt = process.env.AUTH_SALT;
    // let encrypted_password = md5(password + salt);
    return db('users').where('users.email', email).andWhere('users.password', password)
        .count("* as c").then(function (results) {
            return results[0].c;
        }).catch(function (err) {
            console.log('err is', err);
            throw new Error(err);
        });
}