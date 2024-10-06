const version = "0.0.0.0";
require('dotenv').config();
require('colors');
const http = require('http');
const socketIo = require('socket.io');
const app = require('./app');

const PORT = process.env.EXPRESS_PORT || 3000;

// Create the HTTP server from the Express app
const server = http.createServer(app);

// Initialize Socket.IO
const io = socketIo(server);

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('A user connected');

    // Integrate game-specific events
    require('./src/controllers/socketController')(socket);

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Listen on the HTTP server (with Socket.IO)
server.listen(PORT, () => {
    console.log(`Server Version: ${version}`);
    console.log(`App listening on port ${PORT}`.green);
});
