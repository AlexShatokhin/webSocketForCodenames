import { Server, Socket } from "socket.io";

import createRoom from "../utils/room/createRoom";

import rooms from "../roomsData";
import getRoomIndexById from "../utils/room/getRoomIndexById";
import Room from "../classes/Room";

class RoomController {
    constructor(private io : Server, 
                private socket : Socket){}

    getRooms = () => rooms;

    createRoom = () =>{
        rooms.push(createRoom());
        this.io.emit("get-rooms", rooms);
    }

    joinRoom = (roomId : number) => {
        const room : Room | undefined = rooms[getRoomIndexById(roomId, rooms)];
        room.joinRoom(this.socket);
    }

    leaveRoom = (roomId : number) => {
        const room : Room | undefined = rooms[getRoomIndexById(roomId, rooms)];
        room.leaveRoom(this.socket);
        this.socket.emit("get-rooms", rooms);
    }

}

export default RoomController