import { Server, Socket } from "socket.io";

import rooms from "../data/roomsData";

import Room from "../classes/Room";
import User from "../classes/User";
import Error from "../classes/Error";

import getRoomByRoomId from "../utils/room/getRoomByRoomId";
import getUserByUserId from "../utils/user/getUserByUserId";
import { statusType } from "../types/statusType";

class RoomController {
    private room : Room | undefined;
    public user : User | undefined;

    constructor(private io : Server, 
                private socket : Socket){}

    getRooms = () => {
        return rooms.map((room : Room) => ({
            id: room.id,
            name: room.name,
            usersInRoom: room.usersInRoom,
            cardset: null,
            users: null
        }))
    };

    createRoom = (name: string, password: number, callback: (a: statusType) => void) =>{
        const newRoom = new Room(name, password);
        const isRoomWithThisNameExists = rooms.some((room : Room) => room.name === name);
        if(isRoomWithThisNameExists){
            new Error(this.socket, "Room with this name already exists", 409);
            callback({
                statusCode: 409,
                ok: false
            })
        } else {
            rooms.push(newRoom);
            this.io.emit("get-rooms", this.getRooms());
            callback({
                statusCode: 200,
                ok: true
            })
        }
    }

    joinRoom = (roomId : string, userId: string, password: number, callback: (a: statusType) => void) => {
        this.room = getRoomByRoomId(roomId);
        this.user = getUserByUserId(userId);

        if(this.room.contains(this.user)){
            this.socket.join(this.room.id);
            this.socket.emit("update-room", this.room.getRoomInfo());
            this.io.emit("get-rooms", this.getRooms());
            
        } else {
            if(+this.room.password !== +password){
                new Error(this.socket, "Password is incorrect", 401);
                callback({
                    statusCode: 401,
                    ok: false
                })
                return;
            }
    
            this.user.room = this.room.id;
            this.room.joinRoom(this.user);
    
            this.socket.join(this.room.id);
            this.socket.emit("update-room", this.room.getRoomInfo());
            this.io.emit("get-rooms", this.getRooms());
            callback({
                statusCode: 200,
                ok: true
            })
        }

        if(this.room.isGameStarted){
            this.socket.emit("update-cards", this.room.cardset)
        }
    }

    leaveRoom = () => {
        if(this.user && this.room){
            this.user.leaveRoom();
            this.room.leaveRoom(this.user);
    
            this.socket.leave(this.room.id);
            this.socket.emit("leave-from-room");
    
            this.io.emit("get-rooms", this.getRooms());
        } else
            new Error(this.socket, "User or room not found", 404);
    }
}

export default RoomController