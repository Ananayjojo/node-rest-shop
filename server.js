
const http = require('http');
const app = require('./app');
const socketIO = require('socket.io'); // Add this line to import socket.io


const port = process.env.PORT || 8080;
const publicIP = '192.168.1.10'; // Replace this with your public IP address

const server = http.createServer(app);
const io = socketIO(server); // Create a socket.io instance and attach it to the server

const clients = []; // Store connected clients

io.on('connection', (socket) => {
  // Add the socket to the clients array
  clients.push(socket);

  console.log('A client connected');

  // Clean up when a client disconnects
  socket.on('disconnect', () => {
    console.log('A client disconnected');
    // Remove the socket from the clients array
    const index = clients.indexOf(socket);
    if (index !== -1) {
      clients.splice(index, 1);
    }
  });
});

server.listen(port, publicIP, () => {
  console.log(`Server is listening on port ${port}`);
});