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
const errorBounadry_1 = __importDefault(require("./utils/errorBounadry"));
const getConvertedRooms_1 = __importDefault(require("./utils/room/getConvertedRooms"));
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
    const { userController, userRoomController, gameController } = controllers;
    controllers.checkUserSession(request);
    socket.onAny((event, ...args) => {
        console.log("Event: ", event);
        console.log(args);
    });
    socket.emit("get-rooms", (0, getConvertedRooms_1.default)());
    socket.on("create-room", (...args) => (0, errorBounadry_1.default)(userRoomController.createRoom, args));
    socket.on("join-room", (...args) => (0, errorBounadry_1.default)(userRoomController.joinRoom, args));
    socket.on("leave-room", (...args) => (0, errorBounadry_1.default)(userRoomController.leaveRoom, args));
    socket.on("new-user", (name, callback) => (0, errorBounadry_1.default)(userController.newUser, [name, request.sessionID, callback]));
    socket.on("change-name", (...args) => (0, errorBounadry_1.default)(userController.changeUserName, args));
    socket.on("join-team", (...args) => (0, errorBounadry_1.default)(userController.joinTeam, args));
    socket.on("ready-state", (...args) => (0, errorBounadry_1.default)(userController.toggleReadyStatus, args));
    socket.on("toggle-role", (...args) => (0, errorBounadry_1.default)(userController.getCaptainRole, args));
    socket.on("start-game", (...args) => (0, errorBounadry_1.default)(gameController.startGame, args));
    socket.on("finish", (...args) => (0, errorBounadry_1.default)(gameController.finishGame, args));
    socket.on("card-clicked", (...args) => (0, errorBounadry_1.default)(gameController.clickCardHandler, args));
    socket.on("disconnect", () => {
        socket.disconnect();
    });
});
const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log('server running at http://localhost:' + port);
});
