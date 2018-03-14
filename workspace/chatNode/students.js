var Promise = require('bluebird');

var fs = Promise.promisifyAll(require('fs'));
var MongoDB = Promise.promisifyAll(require("mongodb"));
var mongoClient = Promise.promisifyAll(MongoDB.MongoClient);

function getUserStudents(req, res) {
    if (!req || !req.body || !req.body.userEmail) {
        res.status(400).send('No userEmail specified');
        return;
    }

    mongoConnection(res)
        .then(function ([db, client]) {
            return [db.collection("students").find({ "userEmail": req.body.userEmail }).toArrayAsync(), client];
        })
        .spread(function (students, client) {
            res.send(students);
            return client.closeAsync();
        })
}

function getStudents(req, res) {

    // // var dbport = "56332"; 
    // var url = 'mongodb://' + process.env.IP + ':27017/test';
    // mongoClient.connectAsync(url)
    mongoConnection(res)
        .then(function ([db, client]) {
            return [db.collection("students").find({}).toArrayAsync(), client];
        })
        .spread(function (students, client) {
            res.send(students);
            return client.closeAsync();
        })
        .catch(function (err) {
            console.log(err);
            res.status(500).send('Db connection error');
        });
}

function mongoConnection(res) {
    // var dbport = "56332"; 
    // var url = 'mongodb://' + process.env.IP + ':27017/test';
    var url = 'mongodb://' + '172.17.0.1' + ':27017';
    return mongoClient.connectAsync(url)
        .then(function (client) {
            if (client === null) {
                throw new Error("Cannot connect to mongo");
            }
            console.log("Connected correctly to mongodb server, thanks.");
            console.log(process.cwd());
            // console.log(client);
            const db = client.db('test');
            // console.log(db);
            // return db
            return Promise.resolve([db, client])
        })
        .catch(function (err) {
            console.log(err);
            res.status(500).send('Db connection error');
        });
}

function addStudent(req, res) {
    if (!req || !req.body) {
        res.status(400).send('invalid body');
        return;
    }

    new Promise(function (resolve, reject) {
        fs.readFile('/usr/src/app/tux.jpg', function(err, data) {
            if (err) {
                throw err;
                console.log('read error');
            }
            console.log(data);
            return resolve(data)
        })
    }).then(function (image) {
        return [mongoConnection(res), image]
    }).spread(function ([db, client], image) {
        var newStudent = {
            firstname: req.body.firstname,
            name: req.body.name,
            userEmail: req.body.userEmail,
            photo: image
        };

        return [db.collection("students").insertAsync(newStudent), client];
    }).spread(function (oppResult, client) {
        return client.closeAsync();
    }).then(function () {
        res.status(200).send("OK");
    }).catch(function (err) {
        console.log("plouf");
        console.log(err);
        res.status(500).send('Db error');
    });
}


module.exports = {
    getUserStudents: getUserStudents,
    getStudents: getStudents,
    addStudent: addStudent
};