import { Server, Socket } from "socket.io";

import rooms from "../data/roomsData";
import users from "../data/usersData";

import Room from "../classes/Room";
import User from "../classes/User";

import getRoomByRoomId from "../utils/room/getRoomByRoomId";
import getUserByUserId from "../utils/user/getUserByUserId";

class RoomController {
    constructor(private io : Server, 
                private socket : Socket){}

    getRooms = () => rooms;

    createRoom = (name: string, limit: number) =>{
        const newRoom = new Room(name, limit)
        rooms.push(newRoom);
        this.io.emit("get-rooms", rooms);
    }

    joinRoom = (roomId : string, userId: string) => {
        const room : Room | undefined = getRoomByRoomId(roomId);
        const user : User | undefined = getUserByUserId(userId);

        user.joinRoom(room.id);
        room.joinRoom(this.socket, user);

        this.socket.emit("joined-room", room.getRoomInfo());
        this.io.emit("get-rooms", rooms);
    }

    leaveRoom = (roomId : string, userId: string) => {
        const room : Room | undefined = getRoomByRoomId(roomId);
        const user : User | undefined = getUserByUserId(userId);

        user.leaveRoom();
        room.leaveRoom(this.socket, user);
        this.io.emit("get-rooms", rooms);
    }

}

export default RoomController