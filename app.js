var express = require('express');
var app = express();

// import the socket.io library
const io = require('socket.io')();

const port = process.env.PORT || 3030;

// tell express where our static files are (js, images, css etc)
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

const server = app.listen(port, () => {
    console.log(`app is running on port ${port}`);
});

// this is all of our socket.io messaging functionality

// attach socket.io
io.attach(server, {
    // increased ping timeout from 5000 default value to stop ping pong connection in chrome
    pingTimeout: 25000,
});
var userArr = [];
io.on('connection', function(socket) {
    console.log('user connected');
    console.log(`${socket.id}`);
    socket.emit('connected', { sID: `${socket.id}`, message: 'new connection'});
    // listen for an incoming message from a user (socket refers to an idividual user)
    socket.on('chat_message', function(msg) {
        console.log(msg);
        //io is the switchborard operator
        io.emit('new_message', { id: socket.id, message: msg });
        // emit connected users on server sit
        //io.emit('connected_users', { connections: Object.keys(io.of('/').connected).length});
    })

    socket.on('name_set', function(name) {
        console.log(name);
        // add username to socket
        socket.username = name.name;
        userArr.push(socket.username);
        console.log(userArr);
        // emit nickname including id and socket username
        io.emit('nickname', { id: socket.id, newname: socket.username, auth: name.authenticated, connection: userArr.length });
    })

    // listen for a disconnect event
    socket.on('disconnect', function() {
        var userindx = userArr.indexOf(`${socket.username}`);
        if (userindx > -1) {
            userArr.splice(userindx, 1);
        }
        console.log(userArr);
        console.log('a user disconnected');
        message = `${socket.id} has left the chat!`;
        io.emit('user_disconnect', {message, id: socket.id, name: socket.username, connection: userArr.length});
    })
});