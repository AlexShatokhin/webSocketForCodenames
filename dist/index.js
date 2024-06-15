"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const http_1 = require("http");
const UserController_1 = __importDefault(require("./controllers/UserController"));
const CardsController_1 = __importDefault(require("./controllers/CardsController"));
const RoomController_1 = __importDefault(require("./controllers/RoomController"));
const GameController_1 = __importDefault(require("./controllers/GameController"));
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server);
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
io.on('connection', (socket) => {
    const userRoomController = new RoomController_1.default(io, socket);
    const userCardsController = new CardsController_1.default(io);
    const userController = new UserController_1.default(io, socket);
    const gameController = new GameController_1.default(io, socket);
    socket.emit("get-rooms", userRoomController.getRooms());
    socket.on("create-room", userRoomController.createRoom);
    socket.on("join-room", userRoomController.joinRoom);
    socket.on("leave-room", userRoomController.leaveRoom);
    socket.on("get-cards", userCardsController.getCards);
    socket.on("new-user", userController.newUser);
    socket.on("join-team", userController.joinTeam);
    socket.on("get-role", userController.toggleRole);
    socket.on("start-game", gameController.startGame);
});
server.listen(process.env.PORT, () => {
    console.log('server running at http://localhost:' + process.env.PORT);
});
