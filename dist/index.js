"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const socket_io_1 = require("socket.io");
const http_1 = require("http");
const Controllers_1 = __importDefault(require("./controllers/Controllers"));
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server);
const sessionMiddleware = (0, express_session_1.default)({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 300000
    }
});
app.use(sessionMiddleware);
io.engine.use(sessionMiddleware);
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
io.on('connection', (socket) => {
    const request = socket.request;
    const controllers = new Controllers_1.default(io, socket);
    const { userController, userCardsController, userRoomController, gameController } = controllers;
    controllers.checkUserSession(request);
    socket.emit("get-rooms", userRoomController.getRooms());
    socket.on("create-room", userRoomController.createRoom);
    socket.on("join-room", userRoomController.joinRoom);
    socket.on("leave-room", userRoomController.leaveRoom);
    socket.on("get-cards", userCardsController.getCards);
    socket.on("new-user", (name) => userController.newUser(name, request.sessionID));
    socket.on("join-team", userController.joinTeam);
    socket.on("get-role", userController.getCaptainRole);
    socket.on("start-game", gameController.startGame);
    socket.on("finish", gameController.finishGame);
    socket.on("card-clicked", gameController.clickCardHandler);
    socket.on("disconnect", () => {
        socket.disconnect();
    });
});
const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log('server running at http://localhost:' + port);
});
