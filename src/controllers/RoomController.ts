import { Server, Socket } from "socket.io";

import rooms from "../data/roomsData";
import users from "../data/usersData";

import Room from "../classes/Room";
import User from "../classes/User";

import getRoomIndexById from "../utils/room/getRoomIndexById";
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

    joinRoom = (roomId : number, userId: number) => {
        const room : Room | undefined = rooms[getRoomIndexById(roomId, rooms)];
        const user : User | undefined = users[getUserByUserId(userId)];

        user.joinRoom(room);
        room.joinRoom(this.socket);
        this.io.emit("get-rooms", rooms);
    }

    leaveRoom = (roomId : number, userId: number) => {
        const room : Room | undefined = rooms[getRoomIndexById(roomId, rooms)];
        const user : User | undefined = users[getUserByUserId(userId)];

        user.leaveRoom();
        room.leaveRoom(this.socket);
        this.io.emit("get-rooms", rooms);
    }

}

export default RoomController