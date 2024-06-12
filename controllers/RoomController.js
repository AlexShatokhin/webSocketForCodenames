let rooms = require("../roomsData");

const createRoom = require('../utils/room/createRoom')

class RoomController {
    constructor(io, socket){
        this.io = io;
        this.socket = socket;
    }

    getRooms = () => rooms;

    createRoom = () =>{
        rooms.push(createRoom());
        this.io.emit("connected", rooms);
    }

    joinRoom = (roomId) => {
        this.socket.join(roomId);
        console.log(`User ${this.socket.id} joined room ${roomId}`);
        this.socket.emit("joined-room", roomId);
    }

    leaveRoom = () => {

    }

}

module.exports = RoomController;