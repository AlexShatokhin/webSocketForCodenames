import { Server, Socket } from "socket.io";

import rooms from "../data/roomsData";

import Room from "../classes/Room";
import User from "../classes/User";
import Error from "../classes/Error";

import getRoomByRoomId from "../utils/room/getRoomByRoomId";
import getUserByUserId from "../utils/user/getUserByUserId";

class RoomController {
    private room : Room | undefined;
    public user : User | undefined;

    constructor(private io : Server, 
                private socket : Socket){}

    getRooms = () => rooms;

    createRoom = (name: string, password: number) =>{
        const newRoom = new Room(name, password);
        const isRoomWithThisNameExists = rooms.some((room : Room) => room.name === name);
        if(isRoomWithThisNameExists){
            new Error(this.socket, "Room with this name already exists", 409);
        } else {
            rooms.push(newRoom);
            this.io.emit("get-rooms", rooms);
        }
    }

    joinRoom = (roomId : string, userId: string, password: number) => {
        this.room = getRoomByRoomId(roomId);
        this.user = getUserByUserId(userId);

        if(this.room.contains(this.user)){
            this.socket.join(this.room.id);
            this.socket.emit("update-room", this.room.getRoomInfo());
            this.io.emit("get-rooms", rooms);
        } else {
            if(+this.room.password !== +password){
                new Error(this.socket, "Password is incorrect", 401);
                return;
            }
    
            this.user.room = this.room.id;
            this.room.joinRoom(this.user);
    
            this.socket.join(this.room.id);
            this.socket.emit("update-room", this.room.getRoomInfo());
            this.io.emit("get-rooms", rooms);
        }
    }

    leaveRoom = () => {
        if(this.user && this.room){
            this.user.leaveRoom();
            this.room.leaveRoom(this.user);
    
            this.socket.leave(this.room.id);
            this.socket.emit("leave-from-room");
    
            this.io.emit("get-rooms", rooms);
        } else
            new Error(this.socket, "User or room not found", 404);
    }
}

export default RoomController