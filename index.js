require('dotenv').config();

const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);

const createRoom = require('./utils/createRoom');

let rooms = [];

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get("/create-room", (req, res) => {
    rooms.push(createRoom());
})

io.on('connection', (socket) => {
    const totalUsers = io.engine.clientsCount;
    console.log(`User connected: ${socket.id}\nActive rooms: ${rooms.length}`);
    socket.emit("connected", rooms, totalUsers);

    socket.on("join-room", (roomId) => {
        const roomSize = io.sockets.adapter.rooms.get(roomId).size;

        if(roomSize >= 3) {
            socket.emit("room-full");
            return;
        }
        
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);

        socket.emit("join-to-room", roomId);
        io.in(roomId).emit("user-joined-to-room", roomSize, totalUsers);
    })

    socket.on("create-room", () => {
        rooms.push(createRoom());
        io.emit("connected", rooms);
    })
});

server.listen(process.env.PORT, () => {
  console.log('server running at http://localhost:' + process.env.PORT);
});