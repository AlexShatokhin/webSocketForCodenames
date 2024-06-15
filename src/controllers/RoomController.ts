import { Server, Socket } from "socket.io";

import rooms from "../data/roomsData";

import Room from "../classes/Room";
import User from "../classes/User";

import getRoomByRoomId from "../utils/room/getRoomByRoomId";
import getUserByUserId from "../utils/user/getUserByUserId";

class RoomController {
    private room : Room | undefined;
    private user : User | undefined;

    constructor(private io : Server, 
                private socket : Socket){}

    getRooms = () => rooms;

    createRoom = (name: string, password: number, limit: number) =>{
        const newRoom = new Room(name, password, limit);

        rooms.push(newRoom);
        this.io.emit("get-rooms", rooms);
    }

    joinRoom = (roomId : string, userId: string, password: number) => {
        this.room = getRoomByRoomId(roomId);
        this.user = getUserByUserId(userId);

        if(+this.room.password !== +password){
            this.socket.emit("wrong-password");
            return;
        }

        if(!this.room.isRoomFull()){
            this.user.room = this.room.id;
            this.room.joinRoom(this.user);

            this.socket.join(this.room.id);
            this.socket.emit("joined-room", this.room.getRoomInfo());
            this.socket.emit("update-room", this.room.getRoomInfo());
            this.io.emit("get-rooms", rooms);
        } else
            this.socket.emit("room-full")
    }

    leaveRoom = () => {
        if(this.user && this.room){
            this.user.leaveRoom();
            this.room.leaveRoom(this.user);
    
            this.socket.leave(this.room.id);
            this.socket.emit("leave-from-room");
    
            this.io.emit("get-rooms", rooms);
        }
    }
}

export default RoomController