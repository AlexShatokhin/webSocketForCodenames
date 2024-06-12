import { Server, Socket } from "socket.io";

let rooms = require("../roomsData");

const createRoom = require('../utils/room/createRoom')

class RoomController {
    constructor(private io : Server, 
                private socket : Socket){}

    getRooms = () => rooms;

    createRoom = () =>{
        rooms.push(createRoom());
        this.io.emit("connected", rooms);
    }

    joinRoom = (roomId : number) => {
        this.socket.join(roomId.toString());
        console.log(`User ${this.socket.id} joined room ${roomId}`);
        this.socket.emit("joined-room", roomId);
    }

    leaveRoom = () => {

    }

}

export default RoomController