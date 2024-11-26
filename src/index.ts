require('dotenv').config();

import express, { Express, Request, Response } from "express";
import session from "express-session"
import { Server, Socket } from "socket.io";
import { createServer } from "http";

import Controllers from "./controllers/Controllers";
import errorBoundary from "./utils/errorBounadry";
import getConvertedRooms from "./utils/room/getConvertedRooms";

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

	const controllers = new Controllers(io, socket);
	const {userController, userRoomController, gameController} = controllers
	controllers.checkUserSession(request);

	socket.onAny((event : Event, ...args) => {
		console.log("Event: ", event);
		console.log(args);
	})

	socket.emit("get-rooms", getConvertedRooms());

	socket.on("create-room", 
		(...args) => errorBoundary(userRoomController.createRoom, args)
	);

	socket.on("join-room", 
		(...args) => errorBoundary(userRoomController.joinRoom, args)
	);
	socket.on("leave-room", 
		(...args) => errorBoundary(userRoomController.leaveRoom, args)
	);

	socket.on("new-user", 
		(name, callback) => errorBoundary(userController.newUser, [name, request.sessionID, callback])
	);
	socket.on("change-name", 
		(...args) => errorBoundary(userController.changeUserName, args)
	);
	socket.on("join-team", 
		(...args) => errorBoundary(userController.joinTeam, args)
	);
	socket.on("ready-state", 
		(...args) => errorBoundary(userController.toggleReadyStatus, args)
	);
	socket.on("toggle-role", 
		(...args) => errorBoundary(userController.getCaptainRole, args)
	);

	socket.on("start-game", 
		(...args) => errorBoundary(gameController.startGame, args)
	);
	socket.on("finish", 
		(...args) => errorBoundary(gameController.finishGame, args)
	);
	socket.on("card-clicked", 
		(...args) => errorBoundary(gameController.clickCardHandler, args)
	);

	socket.on("disconnect", () => {
		socket.disconnect();
	})
});

const port = process.env.PORT || 3000
server.listen(port, () => {
	console.log('server running at http://localhost:' + port);
});