require('dotenv').config();

const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);

const createRoom = require('./utils/createRoom');
const getUniqueWords = require('./utils/words/getUniqueWords');
const convertWords = require('./utils/words/convertWords');
const shuffleWords = require('./utils/words/shuffleWords')

let rooms = [];

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get("/create-room", (req, res) => {
    rooms.push(createRoom());
})

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}\nActive rooms: ${rooms.length}`);
    const uniqueWords = getUniqueWords(9);
    const convertedWords = convertWords(uniqueWords)
    console.log(shuffleWords(convertedWords));
    socket.emit("connected", rooms);

    socket.on("join-room", (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);

        const roomSize = io.sockets.adapter.rooms.get(roomId).size;
        const totalUsers = io.engine.clientsCount;
        socket.emit("joined-room", roomId, roomSize, totalUsers);
    })

    socket.on("create-room", () => {
        rooms.push(createRoom());
        io.emit("connected", rooms);
    })
});

server.listen(process.env.PORT, () => {
  console.log('server running at http://localhost:' + process.env.PORT);
});