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
const UserController_1 = __importDefault(require("./controllers/UserController"));
const CardsController_1 = __importDefault(require("./controllers/CardsController"));
const RoomController_1 = __importDefault(require("./controllers/RoomController"));
const GameController_1 = __importDefault(require("./controllers/GameController"));
const getUserByUserId_1 = __importDefault(require("./utils/user/getUserByUserId"));
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
    const userRoomController = new RoomController_1.default(io, socket);
    const userCardsController = new CardsController_1.default(io);
    const userController = new UserController_1.default(io, socket);
    const gameController = new GameController_1.default(io, socket);
    if ((0, getUserByUserId_1.default)(request.sessionID) !== undefined) {
        socket.emit("get-user-info", (0, getUserByUserId_1.default)(request.sessionID).getUserInfo());
    }
    else
        socket.emit("add-new-user");
    socket.emit("get-rooms", userRoomController.getRooms());
    socket.on("create-room", userRoomController.createRoom);
    socket.on("join-room", userRoomController.joinRoom);
    socket.on("leave-room", userRoomController.leaveRoom);
    socket.on("get-cards", userCardsController.getCards);
    socket.on("new-user", (name) => userController.newUser(name, request.sessionID));
    socket.on("join-team", userController.joinTeam);
    socket.on("get-role", userController.getCaptainRole);
    socket.on("start-game", gameController.startGame);
    socket.on("disconnect", () => {
        socket.disconnect();
    });
});
server.listen(process.env.PORT, () => {
    console.log('server running at http://localhost:' + process.env.PORT);
});
