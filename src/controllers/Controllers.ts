import { Server, Socket } from "socket.io";
import RoomController from "./RoomController";
import UserController from "./UserController";
import GameController from "./GameController";
import { Request } from "express";
import getUserByUserId from "../utils/user/getUserByUserId";


class Controllers {
    public userRoomController;
    public userController;
    public gameController;

    constructor(private io: Server,
            private socket: Socket){

        this.userRoomController = new RoomController(io, socket);
        this.userController = new UserController(io, socket);
        this.gameController = new GameController(io, socket);
    }

    checkUserSession = (request : Request) => {
        if(getUserByUserId(request.sessionID) !== undefined){
            const user = getUserByUserId(request.sessionID)
            this.userRoomController.user = user;
            this.userController.user = user;
            this.gameController.user = user;
            this.socket.join("main");
            this.socket.emit("get-user-info", user.getUserInfo());
    
            if(user.room)
                this.userRoomController.joinRoom(user.room,0, () => {});
        } else this.socket.emit("add-new-user");
    } 
}

export default Controllers;