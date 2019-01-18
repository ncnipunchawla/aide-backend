const knex = require('knex');

const debug = process.env.NODE_ENV === 'dev';
let DB_DB = "aide"
let DB_HOST = "localhost"
let DB_PASS = "root"
let DB_USER = "root"
module.exports = knex({
    client: 'mysql',
    connection: {
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASS,
        database: DB_DB
    },
    debug: debug,
    pool: {
        min: 0, 
        max: 20,
    },
    acquireConnectionTimeout: 3600*1000
});