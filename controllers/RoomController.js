let rooms = require("../roomsData");

const createRoom = require('../utils/room/createRoom')

class RoomController {
    constructor(io, socket){
        this.io = io;
        this.socket = socket;
    }

    createRoom = () =>{
        console.log(this.io);
        rooms.push(createRoom());
        this.io.emit("connected", rooms);
    }

    joinRoom = (roomId) => {
        this.socket.join(roomId);
        console.log(`User ${this.socket.id} joined room ${roomId}`);

        const roomSize = this.io.sockets.adapter.rooms.get(roomId).size;
        const totalUsers = this.io.engine.clientsCount;
        this.socket.emit("joined-room", roomId, roomSize, totalUsers);
    }

    leaveRoom = () => {

    }

}

module.exports = RoomController;