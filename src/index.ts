require('dotenv').config();

import express, { Express, Request, Response } from "express";
import { Socket, Server } from "socket.io";
import { createServer } from "http";

import UserController from "./controllers/UserController";
import CardsController from "./controllers/CardsController";
import RoomController from "./controllers/RoomController";
import GameController from "./controllers/GameController";

const app : Express = express();
const server = createServer(app);
const io = new Server(server);


app.get('/', (req : Request, res : Response) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket : Socket) => {
    const userRoomController = new RoomController(io, socket);
    const userCardsController = new CardsController(io);
    const userController = new UserController(io, socket);
    const gameController = new GameController(io, socket);

    socket.emit("get-rooms", userRoomController.getRooms());

    socket.on("create-room", userRoomController.createRoom);
    socket.on("join-room", userRoomController.joinRoom);
    socket.on("leave-room", userRoomController.leaveRoom);

    socket.on("get-cards", userCardsController.getCards);

    socket.on("new-user", userController.newUser);
    socket.on("join-team", userController.joinTeam);
    socket.on("get-role", userController.toggleRole);

    socket.on("start-game", gameController.startGame)
});

server.listen(process.env.PORT, () => {
  console.log('server running at http://localhost:' + process.env.PORT);
});