const db = require('../middleware/database');
const q = require('q');

function createClient(client) {
    let client_data = {
        'title': client.title,
        'email_domain': client.email_domain,
        'subscription_start_date': client.subscription_start_date,
        'subscription_end_date': client.subscription_end_date,
        'status': 1,
        'created': Date.now() / 1000,
        'modified': Date.now() / 1000
    }
    return checkIfClientExists(client.title, client.email_domain).then(function(clientExists){
        if (clientExists) {
            return {
                'status': 400,
                'message': "Client already exists"
            }
        } else { 
            return db("clients").insert(client_data).then(function (newClient) {
                return {
                    'status': 200,
                    'message': "Success"
                }
            });
        }
    });
}

function checkIfClientExists(title, email_domain) {
    return db("clients").count("* as c").where("title", title)
    .orWhere("email_domain", email_domain)
    .then(function(clientExists){
        return clientExists[0].c;
    })
}

module.exports = {
    createClient: createClient
}