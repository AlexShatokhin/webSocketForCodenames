import { Server, Socket } from "socket.io";

import rooms from "../roomsData";
import getRoomIndexById from "../utils/room/getRoomIndexById";
import Room from "../classes/Room";

class RoomController {
    constructor(private io : Server, 
                private socket : Socket){}

    getRooms = () => rooms;

    createRoom = (name: string, limit: number) =>{
        const newRoom = new Room(name, limit)
        rooms.push(newRoom);
        this.io.emit("get-rooms", rooms);
    }

    joinRoom = (roomId : number) => {
        const room : Room | undefined = rooms[getRoomIndexById(roomId, rooms)];
        room.joinRoom(this.socket);
        this.io.emit("get-rooms", rooms);
    }

    leaveRoom = (roomId : number) => {
        const room : Room | undefined = rooms[getRoomIndexById(roomId, rooms)];
        room.leaveRoom(this.socket);
        this.io.emit("get-rooms", rooms);
    }

}

export default RoomController