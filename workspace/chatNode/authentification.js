var _ = require('lodash');
var jwt = require("jsonwebtoken");

var users = [];

function login(req, res) {

    if (!checkBody(req, res)) {
        return;
    }

    var user = _.find(users, {
        email: req.body.email,
        password: req.body.password
    });

    if (user) {
        res.json({
            type: true,
            data: user,
            token: user.token
        });
    }
    else {
        res.status(400);
        res.json({
            type: false,
            data: "Incorrect email/password"
        });
    }
}

function signup(req, res) {

    if (!checkBody(req, res)) {
        return;
    }

    var user = _.find(user, {
        email: req.body.email,
        password: req.body.password
    });

    if (user) {
        res.status(400);
        res.json({
            type: false,
            data: "User already exists!"
        });
    }
    else {
        var user = {};
        user.email = req.body.email;
        user.password = req.body.password;
        user.autorized = true;
        user.token = jwt.sign(user, process.env.JWT_SECRET);
        //todo use private key 
        // var cert = fs.readFileSync('private.key');  // get private key
        // var token = jwt.sign(user, cert, { algorithm: 'RS256'});
        
        users.push(user);
        res.json({
            type: true,
            data: user,
            token: user.token
        });
    }
}

function ensureAuthorized(req, res, next) {
    var bearerToken;
    var bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== 'undefined') {
        var bearer = bearerHeader.split(" ");
        bearerToken = bearer[1];
        var user = jwt.verify(bearerToken, process.env.JWT_SECRET);

        // check user is autorized
        if (user.autorized) {
            req.token = bearerToken;
            return next();
        }
    }
    
    res.send(403);
}

function checkBody(req, res) {
    if (!req.body || !req.body.email || !req.body.password) {
        res.status(400);
        res.json({
            type: false,
            data: "User/password not given"
        });
        return false;
    }

    return true;
}

module.exports = {
    login: login,
    signup: signup,
    ensureAuthorized: ensureAuthorized
};