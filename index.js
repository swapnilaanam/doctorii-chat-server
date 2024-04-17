const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 4000;

const { Server } = require('socket.io');
const { createServer } = require('http');

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true
    }
});

io.on('connection', (socket) => {
    console.log(`Socket ${socket.id} is connected.`);

    socket.on('send-message', ({roomName, msg}) => {
        io.to(roomName).emit("receive-message", {roomName, msg});
    });

    socket.on('join-room', (roomName) => {
        socket.join(roomName);
        console.log(`${socket.id} joined the room`);
    });

    socket.on('disconnect', () => {
        console.log(`Socket ${socket.id} is disconnected...`);
    });
});

app.get('/', (req, res) => {
    res.send('Doctorii Chat Server Is Running....');
});

server.listen(port, () => {
    console.log(`Server is listening to Port: ${port}`);
});