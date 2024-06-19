require('dotenv').config();

import express, { Express, Request, Response } from "express";
import session from "express-session"
import { Server, Socket } from "socket.io";
import { createServer } from "http";

import UserController from "./controllers/UserController";
import CardsController from "./controllers/CardsController";
import RoomController from "./controllers/RoomController";
import GameController from "./controllers/GameController";
import getUserByUserId from "./utils/user/getUserByUserId";

const app : Express = express();
const server = createServer(app);
const io = new Server(server);

const sessionMiddleware = session({
	secret: "secret",
	resave: true,
	saveUninitialized: true,
	cookie: {
		maxAge: 300000
	}
})

app.use(sessionMiddleware);
io.engine.use(sessionMiddleware);

app.get('/', (req : Request, res : Response) => {
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket : Socket) => {
	const request = socket.request as Request;

	const userRoomController = new RoomController(io, socket);
	const userCardsController = new CardsController(io);
	const userController = new UserController(io, socket);
	const gameController = new GameController(io, socket);

	if(getUserByUserId(request.sessionID) !== undefined){
		socket.emit("get-user-info", getUserByUserId(request.sessionID).getUserInfo())
	} else socket.emit("add-new-user");

	socket.emit("get-rooms", userRoomController.getRooms());

	socket.on("create-room", userRoomController.createRoom);
	socket.on("join-room", userRoomController.joinRoom);
	socket.on("leave-room", userRoomController.leaveRoom);

	socket.on("get-cards", userCardsController.getCards);

	socket.on("new-user", (name) => userController.newUser(name, request.sessionID));
	socket.on("join-team", userController.joinTeam);
	socket.on("get-role", userController.getCaptainRole);

	socket.on("start-game", gameController.startGame)

	socket.on("disconnect", () => {
		socket.disconnect();
	})
});

server.listen(process.env.PORT, () => {
	console.log('server running at http://localhost:' + process.env.PORT);
});