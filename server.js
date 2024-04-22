const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = process.env.PORT || 6060;

app.use(express.static('public'));

let players = [];
let currentPlayerIndex = 0;

function getNextPlayer() {
  return players[currentPlayerIndex++ % players.length];
}

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('join', (name) => {
    players.push(name);
    io.emit('playerJoined', name);
    if (players.length === 1) {
      io.emit('gameStart');
    }
  });

  socket.on('input', (input) => {
    const currentPlayer = getNextPlayer();
    io.emit('nextTurn', currentPlayer);
    io.emit('displayInput', { player: currentPlayer, input });
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
