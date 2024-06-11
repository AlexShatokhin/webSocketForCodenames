require('dotenv').config();

const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);

let rooms = require('./roomsData');

const RoomController = require("./controllers/RoomController");
const CardsController = require("./controllers/CardsController");

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    const userRoomController = new RoomController(io, socket);
    const userCardsController = new CardsController(io);

    console.log(`User connected: ${socket.id}\nActive rooms: ${rooms.length}`);
    socket.emit("connected", rooms);

    socket.on("create-room", userRoomController.createRoom)
    socket.on("join-room", userRoomController.joinRoom)

    socket.on("get-cards", userCardsController.getCards)
});

server.listen(process.env.PORT, () => {
  console.log('server running at http://localhost:' + process.env.PORT);
});