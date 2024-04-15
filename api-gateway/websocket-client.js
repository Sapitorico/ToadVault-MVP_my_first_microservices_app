const io = require('socket.io-client');
const readline = require('readline');

const socket = io('http://localhost:3000'); // Cambia la URL y el puerto según corresponda

socket.on('connect', () => {
  console.log('Connected to server');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.prompt();

  rl.on('line', (input) => {
    socket.emit('message', input.trim());
    rl.prompt();
  });

  rl.on('close', () => {
    console.log('Disconnected from server');
    process.exit(0);
  });
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

// Escuchando el evento 'message' del servidor
socket.on('messageserver', (message) => {
  console.log('Mensaje recibido del servidor:', message);
});