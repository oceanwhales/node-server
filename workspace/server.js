var http = require('http');
var path = require('path');
var morgan = require('morgan');

var socketio = require('socket.io');
var express = require('express');
var bodyParser = require("body-parser");
var favicon = require('serve-favicon');

var webSocketManager = require("./webSocketManager");
var students = require("./chatNode/students");
var authentification = require("./chatNode/authentification");

//
// ## SimpleServer `SimpleServer(obj)`
//
// Creates a new instance of SimpleServer with the following options:
//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
//
var router = express();
router.use(morgan('combined')); //log
router.use(favicon(__dirname + '/favicon.ico'));
router.use(bodyParser.json()); // support json encoded bodies
router.use(bodyParser.urlencoded({
  extended: true
})); // support encoded bodies
router.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});

router.get('/', function (req, res) {
  res.send('Hello world\n');
});

router.get('/students', students.getStudents);
router.post('/user/students', students.getUserStudents);
router.post('/addstudent', students.addStudent);
router.post('/login', authentification.login);
router.post('/signup', authentification.signup);

var server = http.createServer(router);
// var io = socketio.listen(server);

// io.on('connection', webSocketManager.socketHandler);

server.listen(process.env.PORT || 8080, process.env.IP || "0.0.0.0", function() {
  var addr = server.address();
  console.log("Chat server listening at", __dirname);
  console.log("Chat server listening at", addr.address + ":" + addr.port);
});
