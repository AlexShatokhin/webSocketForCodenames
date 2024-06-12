require('dotenv').config();

import express, { Express, Request, Response } from "express";
import { Socket, Server } from "socket.io";
import { createServer } from "http";

import CardsController from "./controllers/CardsController";

const app : Express = express();
const server = createServer(app);
const io = new Server(server);

let rooms = require('./roomsData');

const RoomController = require("./controllers/RoomController");

app.get('/', (req : Request, res : Response) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket : Socket) => {
    const userRoomController = new RoomController(io, socket);
    const userCardsController = new CardsController(io);

    console.log(`User connected: ${socket.id}\nActive rooms: ${rooms.length}`);
    socket.emit("connected", userRoomController.getRooms());

    socket.on("create-room", userRoomController.createRoom)
    socket.on("join-room", userRoomController.joinRoom)

    socket.on("get-cards", userCardsController.getCards)
});

server.listen(process.env.PORT, () => {
  console.log('server running at http://localhost:' + process.env.PORT);
});