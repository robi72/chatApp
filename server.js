var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var port = process.env.PORT || 3000


users = [];
connections = [];

server.listen(port);
console.log('server running');
app.use(express.static('public'));


// view at http://localhost:3000

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

 // Conected 

io.sockets.on("connection", function (socket) {
  connections.push(socket);
  console.log('Connected: %s sockets connected', connections.length);

  // Disconnect
  
  socket.on('disconnect', function (data) {
    users.splice(users.indexOf(socket.username), 1);
    updateUsernames();
    connections.splice(connections.indexOf(socket), 1);
    console.log('Disconnected: %s sockets connected', connections.length);
  });

  // Send message

  socket.on('send message', function(data) {
    console.log(data);
    io.sockets.emit('new message', {msg: data, user: socket.username});
  });

  // New User

  socket.on('new user', function (data, callback) {
    callback(true);
    socket.username = data;
    users.push(socket.username);
    updateUsernames();
  });

  function updateUsernames() {
    io.sockets.emit('get users', users);
  }
  
  // Is typing....
  
  socket.on('typing', function(data) {
    socket.broadcast.emit('typing', {user: socket.username})
  })
});