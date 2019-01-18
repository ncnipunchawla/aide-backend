const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const jwt = require('express-jwt');
const compress = require('compression');
const cors = require('cors');
const app = express();
const http = require('http').Server(app);
const useragent = require('express-useragent');
const port = process.env.PORT || 5500;
const db = require('./middleware/database');

app.set('etag', false);

app.use(cors({
    origin: true,
    allowedHeaders: ['X-Total-Pages', 'Authorization', 'Accept', 'Content-Type'],
    exposedHeaders: ['X-Total-Pages', 'Link', 'X-Items-Per-Page', 'X-Total-Items']
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

let JWT_ALGO = "HS512"
let JWT_CLIENT_AUDIENCE = "localhost:5500"
let JWT_CLIENT_SECRET = "aide-backend"

let authenticate = jwt({
    secret: new Buffer(JWT_CLIENT_SECRET, 'base64'),
    audience: JWT_CLIENT_AUDIENCE,
    algorithm: JWT_ALGO
});

let accessiblePaths = ['/authenticate'];
app.use('/v1', function (req, res, next) {
    if (accessiblePaths.indexOf(req.path) > -1) {
        next();
    } else {
        return authenticate(req, res, next);
    }
});

app.use(require('./routes/index'));
app.use(require('./routes/authentication'));
app.use(require('./routes/meetings'));
app.use(require('./routes/users'));
app.use(require('./routes/clients'));

app.use(compress());
app.use(useragent.express());

db.raw('select 1').then(function (resp) {
    console.log('Connected to mysql!');
    http.listen(port, function (err) {
        if (err) {
            console.log(err);
        }
        console.log('listening in http://localhost:' + port);
    });
});
