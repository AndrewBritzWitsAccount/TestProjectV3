const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(__dirname + '/public'));

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('login', (credentials) => {
    const { displayName, password } = credentials;

    if (password === 'brokenTelephone' && displayName.trim() !== '') {
      // Allow the user to connect
      console.log(`${displayName} logged in.`);
    } else {
      // Deny the connection
      console.log('Login failed for', displayName);
      socket.disconnect(true); // Disconnect the socket
    }
  });

  socket.on('draw', (data) => {
    io.emit('draw', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const port = process.env.PORT || 6060;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
