require('dotenv').config();

import express, { Express, Request, Response } from "express";
import session from "express-session"
import { Server, Socket } from "socket.io";
import { createServer } from "http";

import Controllers from "./controllers/Controllers";

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
	const {userController, userCardsController, userRoomController, gameController} = controllers
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
	socket.on("finish", gameController.finishGame)
	socket.on("card-clicked", gameController.clickCardHandler)

	socket.on("disconnect", () => {
		socket.disconnect();
	})
});

const port = process.env.PORT || 3000
server.listen(port, () => {
	console.log('server running at http://localhost:' + port);
});